import type { NextApiRequest, NextApiResponse } from "next";
import { taskService } from "@/src/services/taskService";
import { userService } from "@/src/services/userService";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, { ...authOptions });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await userService.getUserById(session.user.id);

  if (!user || !user.shelters) {
    return res.status(403).json({ message: "Shelter not assigned to user" });
  }

  const { shelterId } = req.query;

  if (req.method === "GET") {
    const tasks = await taskService.getAllTasks(shelterId?.toString() ?? "");
    res.status(200).json(tasks);
  } else if (req.method === "POST") {
    const newTask = await taskService.createTask(
      user.id,
      shelterId?.toString() ?? "",
      req.body
    );
    res.status(201).json(newTask);
  } else if (req.method === "PUT") {
    const updatedTask = await taskService.updateTask(user.id, req.body);
    res.status(200).json(updatedTask);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
