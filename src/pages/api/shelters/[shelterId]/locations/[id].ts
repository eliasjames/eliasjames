import type { NextApiRequest, NextApiResponse } from "next";
import { locationService } from "@/src/services/locationService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  console.log("id from api", { id });

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (req.method === "GET") {
    const location = await locationService.getLocationById(id);
    if (location) {
      res.status(200).json(location);
    } else {
      res.status(404).json({ error: "location not found" });
    }
  } else if (req.method === "PUT") {
    const updatedlocation = await locationService.updateLocation(req.body);
    if (updatedlocation) {
      res.status(200).json(updatedlocation);
    } else {
      res.status(404).json({ error: "location not found" });
    }
  } else if (req.method === "DELETE") {
    const success = await locationService.deleteLocation(id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "location not found" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
