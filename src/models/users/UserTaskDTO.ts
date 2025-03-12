import { TaskStatus, User, Staff, AnimalTask, Task } from "@prisma/client";

export default interface UserTaskDTO {
  id: string;
  title: string;
  status: TaskStatus;
  userId: string;
  taskId: string;
  animalTaskId: string;
  staffId?: string | null;
  assignedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date | null;
  user?: User;
  staff?: Staff;
  animalTask?: AnimalTask;
  task?: Task;
  staffName?: string;
  completedBy?: string | null;
}
