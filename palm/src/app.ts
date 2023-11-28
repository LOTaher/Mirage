import { App } from "@slack/bolt";
import "./utils/env";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: 3000,
});

app.command("/attendance", async ({ command, ack, say }) => {
  try {
    await ack();
    const channel_id: string = command.channel_id;

    // Post message to the channel
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

app.command("/resources", async ({ command, ack, say }) => {
  await ack();

  const user_name: string = command.user_name;
  const channel_id: string = command.channel_id;

  const result = await say({
    channel: channel_id,
    text: "https://oasisneu.com/resources",
  });
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

(async () => {
  await app.start();
  console.log("App Running");
})();
