import { Staff, Task, TaskStatus } from "@prisma/client";
import { CreateOrUpdateTaskDTO } from "../tasks/CreateOrUpdateTaskDTO";

export interface AnimalTaskDTO {
  task: CreateOrUpdateTaskDTO;
  staffName: string | null;
  status: TaskStatus;
  staffId?: string | null;
  title?: string | null;
  dueDate?: Date | undefined;
  assignedStaffIds: string[];
  dueTime?: string | undefined;
  completedByUserId?: string | null;
  lastUpdatedByUserId?: string | null;
  createdByUserId?: string | null;
}
