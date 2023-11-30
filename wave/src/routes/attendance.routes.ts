import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const attendanceRouter = Router();
const prisma = new PrismaClient();

attendanceRouter.post("/:sessionName", async (req, res) => {
  const { sessionName } = req.params;
  const { slackID, userName } = req.body;

  try {
    let session = await prisma.session.findUnique({
      where: { name: sessionName },
      include: { people: true },
    });

    if (!session) {
      session = await prisma.session.create({
        data: {
          name: sessionName,
          attendance: 0,
        },
        include: { people: true },
      });
    }

    let user = await prisma.member.findUnique({
      where: { slackID },
    });

    if (!user) {
      user = await prisma.member.create({
        data: {
          name: userName,
          slackID,
        },
      });
    }

    if (!session.people.some((member) => member.id === user!.id)) {
      await prisma.session.update({
        where: { id: session.id },
        data: {
          people: {
            connect: { id: user.id },
          },
          attendance: { increment: 1 },
        },
      });
    }

    res.status(200).json({ message: "Attendance recorded!" });
  } catch (error) {
    console.error("Failed to record attendance:", error);
    res.status(500).json({ error: "Internal server error!" });
  }
});

export default attendanceRouter;
