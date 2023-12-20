import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const memberRouter = Router();
const prisma = new PrismaClient();

memberRouter.get("/:slackID", async (req, res) => {
  const { slackID } = req.params;

  try {
    let member = await prisma.member.findUnique({
      where: { slackID: slackID },
      include: { sessions: true },
    });

    if (member) {
      res.json(member);
    } else {
      res.status(404).json({ message: "Member not found." });
    }
  } catch (error) {
    console.error("Failed to retrieve member:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default memberRouter;
