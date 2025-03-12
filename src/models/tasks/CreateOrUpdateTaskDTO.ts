import { TaskAssignment, TaskFrequency, TaskType } from "@prisma/client";
import UserDTO from "../users/UserDTO";
import UserTaskDTO from "../users/UserTaskDTO";

export interface CreateOrUpdateTaskDTO {
  id?: string;
  title: string;
  staffId?: string | null;
  shelterId?: string | null;
  roleRestrictions: string[];
  staffRestrictions: string[];
  type: TaskType[];
  frequency: TaskFrequency;
  description?: string | null;
  notes?: string | null;
  dueDate?: Date | null;
  dueTime?: string | null;
  assignmentCategories?: TaskAssignment[];
  assignmentAnimalIds?: string[];
  assignedStaffIds?: string[];
  createdBy?: string;
  user?: UserDTO;
  userTasks?: UserTaskDTO[];
  completedByUserId?: string | null;
  lastUpdatedByUserId?: string | null;
  locationsIds?: string[];
}
