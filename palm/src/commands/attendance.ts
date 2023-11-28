/*
Command: /attendance
Usage: /attendance [hack session #]
Description: Tracks attendance of each hack session via message reactions.
Author(s): Laith Taher
*/

import { App } from "@slack/bolt";

export const attendance = (app: App): void => {
  app.command("/attendance", async ({ command, ack, say }) => {
    try {
      await ack();
      const channel_id: string = command.channel_id;

      const result = await say({
        channel: channel_id,
        text: "🌴 React with a 👍 if you are at the meeting today!",
      });

      await app.client.reactions.add({
        token: process.env.SLACK_BOT_TOKEN,
        name: "thumbsup",
        channel: channel_id,
        timestamp: result.ts,
      });
    } catch (error) {
      console.log(error);
    }
  });

  // app.event("reaction_added", async ({ event, client }) => {
  //   if (event.reaction == "+1") {
  //     try {
  //       await client.chat.postMessage({
  //         channel: "C0651GC40NA",
  //         text: `<@${event.user}> is at the meeting!`,
  //       });

  //       await client.chat.postEphemeral({
  //         channel: event.item.channel,
  //         user: event.user,
  //         text: "Registered!",
  //       });
  //       console.log("event triggered");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // });
};
