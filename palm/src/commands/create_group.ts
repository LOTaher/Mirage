/*
Command: /create_group
Usage: /create_group [Member Slack ID] [Member Slack ID] [Member Slack ID] [Member Slack ID] [Repository]
Description: Initializes an Oasis group into the database.
Author(s): Laith Taher
*/

import { App } from "@slack/bolt";
import { Member } from "../utils/types";
import { UsersInfoResponse } from "@slack/web-api";
import { eboard, mentors } from "../utils/auth";

export const create_group = (app: App): void => {
  app.command("/create_group", async ({ command, ack, respond }) => {
    try {
      await ack();

      const groupNumber: string = command.channel_name.slice(-2);
      const args: string[] = command.text.split(" ");
      const repository: string = args.pop() || "";
      const mentor: string = command.user_name;
      const user_id: string = command.user_id;

      if (!eboard.includes(user_id) || !mentors.includes(user_id)) {
        await respond({
          text: "Sorry, you do not have permission to use this command.",
          response_type: "ephemeral",
        });
        return;
      }

      if (!args) {
        await respond({
          text: "Please provide members and a GitHub repository. Usage: `/count [Member Slack ID] [Member Slack ID] [Member Slack ID] [Member Slack ID] [Repository]`",
          response_type: "ephemeral",
        });
        return;
      }

      const membersPromises = args.map(
        async (slackID): Promise<Member | null> => {
          try {
            const userInfoResponse = (await app.client.users.info({
              user: slackID,
            })) as UsersInfoResponse;
            if (userInfoResponse.user && userInfoResponse.user.name) {
              return {
                name: userInfoResponse.user.name,
                slackID: slackID,
              };
            }
            return null;
          } catch (error) {
            console.error(
              `Error retrieving user info for Slack ID ${slackID}:`,
              error,
            );
            return null;
          }
        },
      );

      const members = (await Promise.all(membersPromises)).filter(
        (member): member is Member =>
          member !== null && member.name !== undefined,
      );

      const response = await fetch(
        `${process.env.WAVE_ROUTE}/group/${groupNumber}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repository,
            mentor,
            members,
          }),
        },
      );

      if (response.ok) {
        await respond({
          text: `Group ${groupNumber} successfully created! Use the /group command to see the group details.`,
          response_type: "ephemeral",
        });
      } else {
        await respond({
          text: "Failed to create group. Please check the input data and try again.",
          response_type: "ephemeral",
        });
      }
    } catch (error) {
      console.error("Error in /groupinit command:", error);
    }
  });
};
