import {
  AdoptionStatus,
  AnimalEvent,
  AnimalFlag,
  AnimalTask,
  BehaviorEvent,
  BehaviorItem,
  CareStatus,
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

export interface AnimalDTO {
  id: string;
  name: string;
  breeds: string[];
  species: Species;
  adoptionStatus: AdoptionStatus;
  shelterId: string;
  sex: Sex;
  spayNeuterStatus: boolean;
  intakeDate?: Date;
  intakeCategory: IntakeCategory;
  dateOfBirth?: Date;
  biography: string;
  createdAt: Date;
  updatedAt: Date;
  imageSrcs: string[];
  primaryImageSrc: string | undefined;
  primaryImageFile?: File | undefined | null;
  outcomeDate: Date | undefined;
  outcomeCategory?: OutcomeCategory;
  outcomeNotes?: string;
  placementInfo: PlacementInfo[];
  shelter: Shelter;
  locationId: string | null;
  events?: AnimalEvent[];
  animalFlags?: AnimalFlag[];
  animalTasks: AnimalTaskDTO[];
  behaviorEvents?: BehaviorEvent[];
  behaviorItems?: BehaviorItem[];
  medicalItems?: MedicalItem[];
  assignedStaffIds: string[];
  currentLocation?: LocationDTO;
  careStatus?: CareStatus;

  animalTasksDueSoon: AnimalTask[];
  animalTasksOverdue: AnimalTask[];
  animalTasksDaily: AnimalTask[];
}
