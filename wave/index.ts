import express from "express";

const app = express();
const port = process.env.PORT;

app.use(express.json);

app.get("/", (req, res) => {
  res.send("Welcome to the Oasis Slack Bot API!");
});

app.listen(port, () => {
  console.log(`🌊 Wave is listening at http://localhost:${port}`);
});
