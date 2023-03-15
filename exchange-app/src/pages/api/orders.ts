import { prisma } from "@/common/libs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  try {
    await prisma.orders.deleteMany();

    body.forEach(
      async ({
        id,
        symbol,
        side,
      }: {
        id: number;
        symbol: string;
        side: string;
      }) => {
        await prisma.orders.create({
          data: {
            id: String(id),
            symbol,
            side,
          },
        });
      }
    );

    res.json({ message: "Orders saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error ocurred trying to save orders" });
  }
}
