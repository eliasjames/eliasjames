import {
  AdoptionStatus,
  AnimalEvent,
  AnimalFlag,
  AnimalTask,
  BehaviorEvent,
  BehaviorItem,
  IntakeCategory,
  MedicalItem,
  OutcomeCategory,
  PlacementInfo,
  Sex,
  Shelter,
  Species,
} from "@prisma/client";
import { AnimalTaskDTO } from "./AnimalTaskDTO";
import { LocationDTO } from "../locations/LocationDTO";

export interface UpdateAnimalDTO {
  id: string;
  name: string;
  breeds: string[];
  species: Species;
  adoptionStatus: AdoptionStatus;
  shelterId: string;
  sex: Sex;
  spayNeuterStatus: boolean;
  intakeDate: Date;
  intakeCategory: IntakeCategory;
  dateOfBirth: Date;
  biography: string;
  imageSrcs: string[];
  primaryImageSrc: string | undefined;
  outcomeDate: Date | undefined;
  outcomeCategory?: OutcomeCategory;
  placementInfo: PlacementInfo[];
  shelter: Shelter;
  events?: AnimalEvent[];
  animalFlags?: AnimalFlag[];
  animalTasks: AnimalTaskDTO[];
  behaviorEvents?: BehaviorEvent[];
  behaviorItems?: BehaviorItem[];
  medicalItems?: MedicalItem[];
  currentLocation?: LocationDTO;
}
