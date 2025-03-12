import { shelterService } from "@/src/services/shelterService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { shelterId } = req.query;

  if (typeof shelterId !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (req.method === "GET") {
    const shelter = await shelterService.getShelterById(shelterId);
    if (shelter) {
      res.status(200).json(shelter);
    } else {
      res.status(404).json({ error: "Shelter not found" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
