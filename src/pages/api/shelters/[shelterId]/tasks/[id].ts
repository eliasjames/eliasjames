import type { NextApiRequest, NextApiResponse } from "next";
import { taskService } from "@/src/services/taskService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (req.method === "GET") {
    const task = taskService.getTaskById(id);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } else if (req.method === "PUT") {
    const updatedTask = taskService.updateTask(id, req.body);
    if (updatedTask) {
      res.status(200).json(updatedTask);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } else if (req.method === "DELETE") {
    const success = await taskService.deleteTask(id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
