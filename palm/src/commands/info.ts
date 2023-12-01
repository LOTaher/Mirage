/*
Command: /info
Usage: /info [slackID]
Description: Gets the attendance info of a specific user.
Author(s): Laith
*/

import { App } from "@slack/bolt";

export const info = (app: App): void => {
  app.command("/info", async ({ command, ack, say }) => {
    // ...
  });
};
