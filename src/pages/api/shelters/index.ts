import { shelterService } from "@/src/services/shelterService";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getServerSession(req, res, { ...authOptions });

    if (!session) {
      res.status(401).end("Unauthorized");
      return;
    }
    const shelters = await shelterService.getAllShelters(session.user.id);
    res.status(200).json(shelters);
  } else if (req.method === "POST") {
    const session = await getServerSession(req, res, { ...authOptions });

    if (!session) {
      res.status(401).end("Unauthorized");
      return;
    }

    const newShelter = await shelterService.createShelter(
      session.user.id,
      req.body
    );
    res.status(201).json(newShelter);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
