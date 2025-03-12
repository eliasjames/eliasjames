import type { NextApiRequest, NextApiResponse } from "next";
import { animalService } from "@/src/services/animalService";
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
    const animals = await animalService.getAllAnimals(
      shelterId?.toString() ?? ""
    );
    res.status(200).json(animals);
  } else if (req.method === "POST") {
    const newAnimal = await animalService.createAnimal(
      shelterId?.toString() ?? "",
      user.id,
      req.body
    );
    res.status(201).json(newAnimal);
  } else if (req.method === "PUT") {
    const updatedAnimal = await animalService.updateAnimal(user.id, req.body);
    res.status(200).json(updatedAnimal);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
