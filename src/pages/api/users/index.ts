import type { NextApiRequest, NextApiResponse } from "next";
import { userService } from "@/src/services/userService";
import { getServerSession } from "next-auth";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { shelterId } = req.query;

  if (req.method === "GET") {
    const users = await userService.getAllUsers(shelterId?.toString() ?? "");
    res.status(200).json(users);
  } else if (req.method === "POST") {
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (req.method === "POST") {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  }
}
