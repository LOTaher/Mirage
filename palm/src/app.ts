import { App } from "@slack/bolt";
import "./utils/env";
import { attendance } from "./commands/attendance";
import { resources } from "./commands/resources";
import { member } from "./commands/member";
import { count } from "./commands/count";
import { create_group } from "./commands/create_group";
import { group } from "./commands/group";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: 3000,
});

// Slash Commands
attendance(app);
resources(app);
member(app);
count(app);
create_group(app);
group(app);

(async () => {
  await app.start();
  console.log("App Running");
})();
