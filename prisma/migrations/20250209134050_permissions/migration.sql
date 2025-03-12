-- CreateEnum for storing permission types
CREATE TYPE "Permission" AS ENUM (
    'CAN_ACCESS_ADOPTION',
    'CAN_ACCESS_BEHAVIOR',
    'CAN_ACCESS_MEDICAL',
    'CAN_ASSIGN_TASK',
    'CAN_CREATE_TASK',
    'CAN_CREATE_USER',
    'CAN_DELETE_ANIMAL',
    'CAN_DELETE_TASK',
    'CAN_DELETE_USER',
    'CAN_EDIT_ANIMAL',
    'CAN_EDIT_SHELTER',
    'CAN_EDIT_TASK',
    'CAN_EDIT_USER'
);

-- AlterTable: ShelterUser
ALTER TABLE "ShelterUser" 
DROP COLUMN "canAccessAdoption",
DROP COLUMN "canAccessBehavior",
DROP COLUMN "canAccessMedical",
DROP COLUMN "canAssignTask",
DROP COLUMN "canCreateTask",
DROP COLUMN "canCreateUser",
DROP COLUMN "canDeleteAnimal",
DROP COLUMN "canDeleteTask",
DROP COLUMN "canDeleteUser",
DROP COLUMN "canEditAnimal",
DROP COLUMN "canEditShelter",
DROP COLUMN "canEditTask",
DROP COLUMN "canEditUser";

ALTER TABLE "ShelterUser"
ADD COLUMN "permissions" "Permission"[];

-- AlterTable: Role
ALTER TABLE "Role"
DROP COLUMN "canAccessAdoption",
DROP COLUMN "canAccessBehavior",
DROP COLUMN "canAccessMedical",
DROP COLUMN "canAssignTask",
DROP COLUMN "canCreateTask",
DROP COLUMN "canCreateUser",
DROP COLUMN "canDeleteAnimal",
DROP COLUMN "canDeleteTask",
DROP COLUMN "canDeleteUser",
DROP COLUMN "canEditAnimal",
DROP COLUMN "canEditShelter",
DROP COLUMN "canEditTask",
DROP COLUMN "canEditUser";

ALTER TABLE "Role"
ADD COLUMN "permissions" "Permission"[];

-- AlterTable: ShelterRole
ALTER TABLE "ShelterRole"
ADD COLUMN "permissions" "Permission"[];

-- AlterTable: UserTask
ALTER TABLE "UserTask"
ADD COLUMN "completedBy" TEXT,
ALTER COLUMN "assignedBy" DROP NOT NULL;

-- AlterTable: ShelterUserInvite
ALTER TABLE "ShelterUserInvite"
DROP COLUMN "canAccessAdoption",
DROP COLUMN "canAccessBehavior",
DROP COLUMN "canAccessMedical",
DROP COLUMN "canAssignTask",
DROP COLUMN "canCreateTask",
DROP COLUMN "canCreateUser",
DROP COLUMN "canDeleteAnimal",
DROP COLUMN "canDeleteTask",
DROP COLUMN "canDeleteUser",
DROP COLUMN "canEditAnimal",
DROP COLUMN "canEditShelter",
DROP COLUMN "canEditTask",
DROP COLUMN "canEditUser";

ALTER TABLE "ShelterUserInvite"
ADD COLUMN "permissions" "Permission"[];