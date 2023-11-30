import express from "express";
import cors from "cors";
import attendanceRouter from "./src/routes/attendance.routes";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Oasis Slack Bot API!");
});

app.use("/attendance", attendanceRouter);

app.listen(port, () => {
  console.log(`🌊 Wave is listening at http://localhost:${port}`);
});
