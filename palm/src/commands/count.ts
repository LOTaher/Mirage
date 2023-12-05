/*
Command: /count
Usage: /count [session name]
Description: Gets the total attendance count of the specified session.
Author(s): Laith Taher
*/

import { App } from "@slack/bolt";
import { authorizedUsers } from "../utils/auth";

export const count = (app: App): void => {
  app.command("/count", async ({ command, ack, respond, say }) => {
    try {
      await ack();

      const session = command.text.trim();
      const user_id = command.user_id;

      if (!authorizedUsers.includes(user_id)) {
        await respond({
          text: "Sorry, you do not have permission to use this command.",
          response_type: "ephemeral",
        });
        return;
      }

      if (!session) {
        await respond({
          text: "Please provide a session. Usage: `/count [session name]`",
          response_type: "ephemeral",
        });
      }

      const response = await fetch(
        `${process.env.WAVE_ROUTE}/attendance/info/${session}`
      );

      if (response.ok) {
        const sessionInfo = await response.json();

        const responseMessage: string = `Total attendence of *${session}* is *${sessionInfo.attendance}*`;

        await say(responseMessage);
      } else {
        await respond({
          text: `Could not find attendance info for session: ${session}. Make sure you have spelled the session name correctly.`,
          response_type: "ephemeral",
        });
      }
    } catch (error) {
      console.error("Error in /count command:", error);
    }
  });
};
