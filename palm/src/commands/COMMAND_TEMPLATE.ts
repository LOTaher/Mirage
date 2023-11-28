/*
Command: /____
Usage: /____ [___]
Description: ____
Author(s): ____, ____
*/

import { App } from "@slack/bolt";

export const command = (app: App): void => {
  app.command("/command", async ({ command, ack, say }) => {
    // ...
  });
};
