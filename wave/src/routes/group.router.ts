import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const groupRouter = Router();
const prisma = new PrismaClient();

groupRouter.post("/:groupNumber", async (req, res) => {
  try {
    const { groupNumber } = req.params;
    const { repository, mentor, members } = req.body;

    if (
      !repository ||
      !Array.isArray(members) ||
      members.some((member) => !member.username || !member.slackID)
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const newGroup = await prisma.group.create({
      data: {
        number: parseInt(groupNumber),
        repository: repository,
        mentor: mentor,
      },
    });

    for (const member of members) {
      try {
        const createdMember = await prisma.member.create({
          data: {
            name: member.username,
            slackID: member.slackID,
            group: {
              connect: { id: newGroup.id },
            },
          },
        });
        console.log(`Member created: ${createdMember.name}`);
      } catch (error) {
        console.error(`Error creating member ${member.username}:`, error);
      }
    }

    res.status(200).json({ message: "Group created successfully" });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default groupRouter;
