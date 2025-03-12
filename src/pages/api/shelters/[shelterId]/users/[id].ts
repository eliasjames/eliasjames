import type { NextApiRequest, NextApiResponse } from "next";
import { userService } from "@/src/services/userService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (req.method === "GET") {
    const user = userService.getUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  }
  if (req.method === "PUT") {
    const user = userService.updateUser(id, req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  }
  if (req.method === "DELETE") {
    const success = await userService.deleteUser(id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
