/*
Command: /member
Usage: /member [slack ID]
Description: Gets the attendance info of a specific member.
Author(s): Laith Taher
*/

import { App } from "@slack/bolt";
import "../utils/env";
import { eboard, mentors } from "../utils/auth";
import { Session } from "../utils/types";

export const member = (app: App): void => {
  app.command("/member", async ({ command, ack, say, respond }) => {
    try {
      await ack();
      const member: string = command.text.trim();
      const user_id: string = command.user_id;

      if (!eboard.includes(user_id) || !mentors.includes(user_id)) {
        await respond({
          text: "Sorry, you do not have permission to use this command.",
          response_type: "ephemeral",
        });
        return;
      }

      const slackIdPattern = /^U[A-Z0-9]{8,11}$/;

      if (!member) {
        await respond({
          text: "Please provide a Slack ID. Usage: `/member [slack ID]`",
          response_type: "ephemeral",
        });
        return;
      }

      if (!slackIdPattern.test(member)) {
        await respond({
          text: "The provided ID does not appear to be a valid Slack ID.",
          response_type: "ephemeral",
        });
        return;
      }

      const response = await fetch(
        `${process.env.WAVE_ROUTE}/member/${member}`,
      );

      if (response.ok) {
        const memberInfo = await response.json();

        let responseMessage: string = `Member <@${memberInfo.slackID}>\nGroup: *${memberInfo.group.number}*\nMentor: *${memberInfo.group.mentor}*\nAttendence:\n`;

        memberInfo.sessions.forEach((session: Session) => {
          responseMessage += `- *${session.name}*\n`;
        });

        await say(responseMessage);
      } else if (response.status == 404) {
        await respond({
          text: "Member not found. Please make sure the Slack ID is correct and that the member is in a group.",
          response_type: "ephemeral",
        });
      } else {
        await respond({
          text: "Failed to retrieve member information. Make sure you have inputted the correct Slack ID.",
          response_type: "ephemeral",
        });
      }
    } catch (error) {
      console.error("Error in /member command:", error);
    }
  });
};
