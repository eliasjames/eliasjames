import { Role } from "@prisma/client";
import UserTaskDTO from "./UserTaskDTO";

interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  preferredName: string;
  pronouns: string | null;
  phone: string | null;
  permissions: string[];
  email: string;
  createdAt: Date;
  updatedAt: Date;
  userTasks: UserTaskDTO[];
  shelterUsers: any[];
  shelters: any[];
  shelterId: string;
  isAdmin: boolean;
  isVolunteer: boolean;
  isFoster: boolean;
  isStaff: boolean;
  role?: Role;
}

export default UserDTO;
