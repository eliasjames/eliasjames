import type { NextApiRequest, NextApiResponse } from "next";
import { animalService } from "@/src/services/animalService";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import { userService } from "@/src/services/userService";
import { shelterService } from "@/src/services/shelterService";

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
    const invites = await shelterService.getAllShelterUserInvites(
      shelterId?.toString() ?? ""
    );
    res.status(200).json(invites);
  } else if (req.method === "POST") {
    const newInvite = await shelterService.createShelterUserInvite(
      shelterId?.toString() ?? "",
      req.body
    );
    res.status(201).json(newInvite);
  } else if (req.method === "DELETE") {
    const deletedInvite = await shelterService.deleteShelterUserInvite(
      shelterId?.toString() ?? "",
      req.body
    );
    res.status(200).json(deletedInvite);
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
