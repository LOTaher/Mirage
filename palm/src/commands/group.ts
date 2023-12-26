/*
Command: /group
Usage: /group [group number]
Description: Gets the info of a specific group
Author(s): Laith Taher
*/

import { App } from "@slack/bolt";
import { eboard, mentors } from "../utils/auth";

export const group = (app: App): void => {
  app.command("/group", async ({ command, ack, say, respond }) => {
    await ack();

    const groupNumber: string = command.text.trim();
    const user_id: string = command.user_id;

    if (!eboard.includes(user_id) || !mentors.includes(user_id)) {
      await respond({
        text: "Sorry, you do not have permission to use this command.",
        response_type: "ephemeral",
      });
      return;
    }

    if (!groupNumber) {
      await respond({
        text: "Please provide a valid group number. Usage: `/group [group number]`",
        response_type: "ephemeral",
      });
      return;
    }

    const response = await fetch(
      `${process.env.WAVE_ROUTE}/group/${groupNumber}`,
    );

    if (response.ok) {
      const groupInfo = await response.json();

      let responseMessage: string = `*Group ${groupInfo.number}*\n*Mentor*: ${groupInfo.mentor}\n*Members*:\n`;

      groupInfo.members.forEach((member: { slackID: string }) => {
        responseMessage += `- <@${member.slackID}>\n`;
      });

      responseMessage += `*Repository*: ${groupInfo.repository}`;

      await say(responseMessage);
    } else {
      await respond({
        text: "Failed to retrieve group information. Make sure you have inputted the correct group number.",
        response_type: "ephemeral",
      });
    }
  });
};
