import { Router } from "express";
import { Member, PrismaClient } from "@prisma/client";

const attendanceRouter = Router();
const prisma = new PrismaClient();

attendanceRouter.post("/:sessionName", async (req, res) => {
  const { sessionName } = req.params;
  const { slackID } = req.body;

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
      return res.status(404).json({
        message:
          "User not found. Please ensure the user is added to a group before taking attendance.",
      });
    }

    const group = await prisma.group.findUnique({
      where: { id: user.groupId },
    });

    if (!group) {
      return res.status(400).json({
        message:
          "User is not part of any valid group. Please add the user to a group before taking attendance.",
      });
    }

    if (!session.people.some((member: Member) => member.id === user!.id)) {
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

attendanceRouter.get("/info/session/:sessionName", async (req, res) => {
  const { sessionName } = req.params;

  try {
    let session = await prisma.session.findUnique({
      where: { name: sessionName },
    });

    if (!session) {
      res.status(404).json({ message: "No session found." });
    } else {
      res.status(200).json({
        attendance: session.attendance,
      });
    }
  } catch (error) {
    console.error("Failed to retrieve attendance count", error);
    res.status(500).json({ error: "Internal server error! " });
  }
});

export default attendanceRouter;
