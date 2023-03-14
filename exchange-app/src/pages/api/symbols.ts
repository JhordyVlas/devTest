import { prisma } from "@/common/libs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  try {
    await prisma.symbols.deleteMany();

    body.forEach(async ({ name, state }: { name: string; state: string }) => {
      await prisma.symbols.create({
        data: {
          name,
          state,
        },
      });
    });

    res.json({ message: "Symbols saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error ocurred trying to save symbols" });
  }
}
