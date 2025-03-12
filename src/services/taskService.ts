import { Species, Task, TaskStatus, UserTask } from "@prisma/client";
import prisma from "../lib/prisma";
import { CreateOrUpdateTaskDTO } from "@/src/models/tasks/CreateOrUpdateTaskDTO";

export const taskService = {
  getAllTasks: async (shelterId: string): Promise<Task[]> => {
    const tasks = await prisma.task.findMany({
      where: { shelterId },
      include: {
        animalTasks: {
          include: {
            animal: true,
          },
        },
        userTasks: {
          include: {
            user: true,
          },
        },
      },
    });
    return tasks;
  },

  getTaskById: async (id: string): Promise<Task | null> => {
    return prisma.task.findUnique({
      where: { id },
    });
  },

  createTask: async (
    userId: string,
    shelterId: string,
    task: CreateOrUpdateTaskDTO
  ): Promise<CreateOrUpdateTaskDTO> => {
    const {
      assignmentAnimalIds,
      assignmentCategories,
      assignedStaffIds = [],
      // assignedRoles,
      createdBy,
      userTasks,
      locationsIds,
      ...taskForCreate
    } = task;

    const createdTask = await prisma.task.create({
      data: {
        ...taskForCreate,
        assignment: task.assignmentCategories ?? [],
        shelterId,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      },
    });

    const createUserTasks = async (animalTaskIds: string[]) => {
      if (assignedStaffIds?.length > 0) {
        const userTasks = assignedStaffIds.flatMap((userId) =>
          animalTaskIds.map((animalTaskId) => ({
            title: task.title,
            status: TaskStatus.INCOMPLETE,
            userId,
            taskId: createdTask.id,
            animalTaskId,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            assignedBy: userId,
          }))
        );

        if (userTasks.length > 0) {
          // Use createMany instead of creating each user task separately
          await prisma.userTask.createMany({
            data: userTasks,
          });
        }
      }
    };

    const createLocationTasks = async (locationIds: string[]) => {
      if (locationIds?.length > 0) {
        const locationTasks = locationIds.map((locationId) => {
          return prisma.locationTask.create({
            data: {
              title: task.title,
              status: TaskStatus.INCOMPLETE,
              locationId,
              taskId: createdTask.id,
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              createdByUserId: userId,
              lastUpdatedByUserId: userId,
            },
          });
        });

        await prisma.$transaction(locationTasks);
      }
    };

    const assignAnimalTasks = async (filter: object) => {
      const animals = await prisma.animal.findMany({ where: filter });
      const animalTasks = await prisma.$transaction(
        animals.map((animal) =>
          prisma.animalTask.create({
            data: {
              title: task.title,
              status: TaskStatus.INCOMPLETE,
              animalId: animal.id,
              taskId: createdTask.id,
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              createdByUserId: userId,
              lastUpdatedByUserId: userId,
            },
          })
        )
      );

      const animalTaskIds = animalTasks.map((at) => at.id);
      await createUserTasks(animalTaskIds);
    };

    if (task.locationsIds && task.locationsIds?.length > 0) {
      await createLocationTasks(task.locationsIds ?? []);
    }

    if (task.assignmentCategories?.includes("ALL_ANIMALS")) {
      await assignAnimalTasks({});
    }

    if (task.assignmentCategories?.includes("ALL_DOGS")) {
      await assignAnimalTasks({ species: Species.DOG });
    }

    if (task.assignmentCategories?.includes("ALL_CATS")) {
      await assignAnimalTasks({ species: Species.CAT });
    }

    if (task.assignmentAnimalIds && task.assignmentAnimalIds?.length > 0) {
      await assignAnimalTasks({ id: { in: task.assignmentAnimalIds } });
    }

    return {
      ...createdTask,
      assignmentCategories: task.assignmentCategories,
      assignmentAnimalIds: task.assignmentAnimalIds,
      assignedStaffIds: task.assignedStaffIds,
      // assignedRoles: task.assignedRoles,
      createdBy: task.createdBy,
      user: task.user,
    };
  },

  updateTask: async (
    userId: string,
    task: CreateOrUpdateTaskDTO
  ): Promise<Task> => {
    const {
      id,
      assignmentAnimalIds,
      assignmentCategories,
      userTasks,
      assignedStaffIds = [],
      // assignedRoles,
      createdBy,
      ...taskForUpdate
    } = task;
    const updatedTask = prisma.task.update({
      where: { id },
      data: {
        ...taskForUpdate,
        updatedAt: new Date(),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      },
    });

    if (userTasks && userTasks?.length > 0) {
      const userTasksUpdate = userTasks.map((userTask) => {
        return prisma.userTask.update({
          where: { id: userTask.id },
          data: {
            status: userTask.status,
            dueDate: userTask.dueDate ? new Date(userTask.dueDate) : undefined,
            assignedBy: "1",
          },
        });
      });

      await prisma.$transaction(userTasksUpdate);
    }

    if (task.assignmentAnimalIds && task.assignmentAnimalIds.length > 0) {
      const animalTasks = task.assignmentAnimalIds?.map((animalId) => {
        return prisma.animalTask.update({
          where: {
            animalId_taskId: {
              animalId: animalId,
              taskId: id ?? "",
            },
          },
          data: {
            ...task,
            userTasks: {
              create: task.userTasks ?? [],
            },
          },
        });
      });

      await prisma.$transaction(animalTasks);
    }

    const createUserTasks = async (animalTaskIds: string[]) => {
      if (assignedStaffIds?.length > 0) {
        const userTasks = assignedStaffIds.flatMap((userId) =>
          animalTaskIds.map((animalTaskId) => ({
            title: task.title,
            status: TaskStatus.INCOMPLETE,
            userId,
            taskId: id ?? "",
            animalTaskId,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            assignedBy: userId,
            lastUpdatedByUserId: userId,
          }))
        );

        if (userTasks.length > 0) {
          // Use createMany instead of creating each user task separately
          await prisma.userTask.createMany({
            data: userTasks,
          });
        }
      }
    };

    const createLocationTasks = async (locationIds: string[]) => {
      if (locationIds?.length > 0) {
        const locationTasks = locationIds.map((locationId) => {
          return prisma.locationTask.create({
            data: {
              title: task.title,
              status: TaskStatus.INCOMPLETE,
              locationId,
              taskId: id ?? "",
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              createdByUserId: userId,
              lastUpdatedByUserId: userId,
            },
          });
        });

        await prisma.$transaction(locationTasks);
      }
    };

    const assignAnimalTasks = async (filter: object) => {
      const animals = await prisma.animal.findMany({ where: filter });
      const animalTasks = await prisma.$transaction(
        animals.map((animal) =>
          prisma.animalTask.create({
            data: {
              title: task.title,
              status: TaskStatus.INCOMPLETE,
              animalId: animal.id,
              taskId: id ?? "",
              dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              staffId: task.staffId,
              // lastUpdatedByUserId: userId,
            },
          })
        )
      );

      const animalTaskIds = animalTasks.map((at) => at.id);
      await createUserTasks(animalTaskIds);
    };

    if (task.locationsIds && task.locationsIds?.length > 0) {
      await createLocationTasks(task.locationsIds);
    }

    if (task.assignmentCategories?.includes("ALL_ANIMALS")) {
      await assignAnimalTasks({});
    }

    if (task.assignmentCategories?.includes("ALL_DOGS")) {
      await assignAnimalTasks({ species: Species.DOG });
    }

    if (task.assignmentCategories?.includes("ALL_CATS")) {
      await assignAnimalTasks({ species: Species.CAT });
    }

    if (task.assignmentAnimalIds && task.assignmentAnimalIds?.length > 0) {
      await assignAnimalTasks({ id: { in: task.assignmentAnimalIds } });
    }

    return updatedTask;
  },

  deleteTask: async (id: string): Promise<Task> => {
    const locations = await prisma.location.findMany();

    const animals = await prisma.animal.findMany();

    const deleteAnimalTasks = animals.map((animal) =>
      prisma.animalTask.deleteMany({
        where: { taskId: id, animalId: animal.id },
      })
    );

    const deleteLocationTasks = locations.map((location) =>
      prisma.locationTask.deleteMany({
        where: { taskId: id, locationId: location.id },
      })
    );

    await prisma.$transaction([...deleteAnimalTasks, ...deleteLocationTasks]);

    return prisma.task.delete({
      where: { id },
    });
  },
};
