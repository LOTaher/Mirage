/*
Command: /attendance
Usage: /attendance [session name]
Description: Tracks attendance of each hack session via message reactions.
Author(s): Laith Taher
*/

import { App } from "@slack/bolt";
import "../utils/env";
import { groupChannels } from "../utils/auth";
import { eboard } from "../utils/auth";

const sessionNameMap: Record<string, string> = {};

export const attendance = (app: App): void => {
  app.command("/attendance", async ({ command, ack, respond }) => {
    try {
      await ack();
      const session: string = command.text.trim();
      const user_id: string = command.user_id;

      if (!eboard.includes(user_id)) {
        await respond({
          text: "Sorry, you do not have permission to use this command.",
          response_type: "ephemeral",
        });
        return;
      }

      if (!session) {
        await respond({
          text: "Please specify a hack session. Usage: `/attendance [hack session #]`",
          response_type: "ephemeral",
        });
        return;
      }

      const messageTimestamps: { channel: string; ts: string }[] = [];

      for (const channel_id of groupChannels) {
        const result = await app.client.chat.postMessage({
          channel: channel_id,
          text: `React with a 👍 if you are at ${session} today!`,
        });

        if (result.ts) {
          sessionNameMap[result.ts] = session;
          messageTimestamps.push({ channel: channel_id, ts: result.ts });
        } else {
          console.error(
            `Failed to get a timestamp for the message in channel ${channel_id}`,
          );
        }
      }

      for (const { channel, ts } of messageTimestamps) {
        try {
          await app.client.reactions.add({
            token: process.env.SLACK_BOT_TOKEN,
            name: "thumbsup",
            channel: channel,
            timestamp: ts,
          });
        } catch (error) {
          console.error(`Error adding reaction in channel ${channel}:`, error);
        }
      }
    } catch (error) {
      console.error("Error in /attendance command:", error);
    }
  });

  app.event("reaction_added", async ({ event, client }) => {
    if (event.reaction == "+1") {
      try {
        const userDetails = await client.users.info({ user: event.user });
        const username = userDetails.user?.name;

        if (username) {
          const sessionName = sessionNameMap[event.item.ts];

          const response = await fetch(
            `${process.env.WAVE_ROUTE}/attendance/${sessionName}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slackID: event.user }),
            },
          );
          if (response.ok) {
            await client.chat.postEphemeral({
              channel: event.item.channel,
              user: event.user,
              text: "Registered!",
            });
          } else {
            await client.chat.postEphemeral({
              channel: event.item.channel,
              user: event.user,
              text: "You are not permitted to register.",
            });
          }
        }
      } catch (error) {
        console.error("Error handling reaction:", error);
      }
    }
  });
};
