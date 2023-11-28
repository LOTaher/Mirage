/*
Command: /resources
Usage: /resources
Description: Provides the Oasis website resources link.
Author(s): Laith Taher
*/

import { App } from "@slack/bolt";

export const resources = (app: App): void => {
  app.command("/resources", async ({ command, ack, say }) => {
    await ack();

    const channel_id: string = command.channel_id;

    const result = await say({
      channel: channel_id,
      text: "https://oasisneu.com/resources",
    });
  });
};
