import { prisma } from "@/common/libs";
import { Announcement } from "@/components/shared";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  try {
    await prisma.announcements.deleteMany();

    body.forEach(async ({ id, title, date, content, link }: Announcement) => {
      await prisma.announcements.create({
        data: {
          id,
          title,
          date,
          content,
          link,
        },
      });
    });

    res.json({ message: "Announcements saved successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error ocurred trying to save announcements" });
  }
}
