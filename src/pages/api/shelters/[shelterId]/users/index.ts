import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import { userService } from "@/src/services/userService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, { ...authOptions });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await userService.getUserById(session.user?.id);

  if (!user || !user.shelters) {
    return res.status(403).json({ message: "Shelter not assigned to user" });
  }

  const { shelterId } = req.query;

  if (req.method === "GET") {
    const users = await userService.getAllUsers(shelterId?.toString() ?? "");
    res.status(200).json(users);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
