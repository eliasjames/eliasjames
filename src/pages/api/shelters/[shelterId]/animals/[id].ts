import type { NextApiRequest, NextApiResponse } from "next";
import { animalService } from "@/src/services/animalService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (req.method === "GET") {
    const animal = await animalService.getAnimalById(id);
    if (animal) {
      res.status(200).json(animal);
    } else {
      res.status(404).json({ error: "Animal not found" });
    }
  } else if (req.method === "PUT") {
    const updatedAnimal = await animalService.updateAnimal(id, req.body);
    if (updatedAnimal) {
      res.status(200).json(updatedAnimal);
    } else {
      res.status(404).json({ error: "Animal not found" });
    }
  } else if (req.method === "DELETE") {
    const success = await animalService.deleteAnimal(id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Animal not found" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
