import { Animal, LocationType } from "@prisma/client";
import { LocationTaskDTO } from "./LocationTaskDTO";

export interface LocationDTO {
  id?: string;
  name: string;
  type: LocationType;
  createdAt?: Date;
  updatedAt?: Date;
  currentAnimals?: Animal[];
  capacity: number;
  locationTasksDueSoon: LocationTaskDTO[];
}
