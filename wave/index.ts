import express from "express";
import cors from "cors";
import attendanceRouter from "./src/routes/attendance.routes";
import memberRouter from "./src/routes/member.routes";
import groupRouter from "./src/routes/group.router";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Oasis Slack Bot API!");
});

app.use("/attendance", attendanceRouter);
app.use("/member", memberRouter);
app.use("/group", groupRouter);

app.listen(port, () => {
  console.log(`🌊 Wave is listening at http://localhost:${port}`);
});
