import prisma from "../lib/prisma";
import {
  Animal,
  AnimalEvent,
  TaskAssignment,
  TaskStatus,
} from "@prisma/client";
import { taskService } from "./taskService";
import { AnimalDTO } from "@/src/models/animals/AnimalDTO";

export const animalService = {
  getAllAnimals: async (shelterId: string): Promise<AnimalDTO[]> => {
    const animals = await prisma.animal.findMany({
      where: { shelterId: shelterId },
      include: {
        animalTasks: {
          include: {
            task: {
              include: {
                userTasks: true,
              },
            },
            staff: true,
          },
        },
        events: true,
        shelter: true,
      },
    });

    return animals.map((animal) => ({
      ...animal,
      animalTasks: animal.animalTasks.map((animalTask) => ({
        ...animalTask,
        userTasks: animalTask.task.userTasks,
        assignmentCategories: animalTask.task.assignment || [],
        assignmentAnimalIds: [],
        assignedStaffIds: animalTask.task.userTasks.map(
          (userTask) => userTask.userId
        ),
        assignedRoles: [],
        task: {
          ...animalTask.task,
          assignmentCategories: animalTask.task.assignment || [],
          assignmentAnimalIds: [],
          assignedStaffIds: animalTask.task.userTasks.map(
            (userTask) => userTask.userId
          ),
          assignedRoles: [],
          userTasks: animalTask.task.userTasks || [],
        },
        staffName: animalTask.staff?.name || null,
        status: animalTask.status,
        staffId: animalTask.staff?.id || null,
        title: animalTask.title,
        dueDate: animalTask.task.dueDate ?? undefined,
        dueTime: animalTask.task.dueTime || undefined,
      })),
      events: animal.events.map((event) => ({
        ...event,
      })),
      primaryImageSrc: animal.primaryImageSrc || undefined,
      imageSrcs: animal.imageSrcs || [],
      intakeDate: animal.intakeDate ? new Date(animal.intakeDate) : undefined,
      dateOfBirth: animal.dateOfBirth
        ? new Date(animal.dateOfBirth)
        : undefined,
      outcomeNotes: animal.outcomeNotes || undefined,
      outcomeDate: animal.outcomeDate || undefined,
      outcomeCategory: animal.outcomeCategory || undefined,
      animalTasksDueSoon: animal.animalTasks.filter((task) => {
        if (!task.dueDate || task.status !== TaskStatus.INCOMPLETE) {
          return false;
        }
        const now = new Date();
        const dueDate = new Date(task.dueDate);

        return (
          dueDate > now && // `dueDate` is in the future
          dueDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000) // `dueDate` is within 24 hours
        );
      }),
      animalTasksOverdue: animal.animalTasks.filter((task) => {
        if (!task.dueDate || task.status !== TaskStatus.INCOMPLETE) {
          return false;
        }
        const now = new Date();
        const dueDate = new Date(task.dueDate);

        return dueDate < now; // `dueDate` is in the past
      }),
      animalTasksDaily: animal.animalTasks.filter((animalTask) => {
        if (animalTask.status !== TaskStatus.INCOMPLETE) {
          return false;
        }

        let dueDate;
        const now = new Date();

        if (!animalTask.task.dueDate) {
          // If dueDate is not provided, set it to today at midnight
          dueDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59,
            999
          );
        } else {
          dueDate = new Date(animalTask.task.dueDate);
        }

        if (animalTask.task.dueTime) {
          const [hours, minutes] = animalTask.task.dueTime
            .split(":")
            .map(Number); // Extract hours and minutes from dueTime string
          dueDate.setHours(hours, minutes, 0, 0);
        } else {
          // Default to midnight if dueTime is not provided
          dueDate.setHours(23, 59, 59, 999);
        }

        // Get midnight today
        const midnightToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999
        );

        return (
          dueDate > now && // `dueDate` is in the future
          dueDate <= midnightToday // `dueDate` is end of day
        );
      }),

      assignedStaffIds: [
        ...new Set(
          animal.animalTasks
            .flatMap((animalTask) => animalTask.task.userTasks || [])
            .map((userTask) => userTask.userId)
        ),
      ],
    }));
  },

  getAnimalById: async (id: string): Promise<AnimalDTO | null> => {
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        animalTasks: {
          include: {
            task: true,
            staff: true,
          },
        },
        events: true,
        shelter: true,
      },
    });

    if (!animal) return null;

    const tasks = animal.animalTasks.map((animalTask) => ({
      task: animalTask.task,
      staffName: animalTask.staff?.name || null,
      status: animalTask.status,
      staffId: animalTask.staff?.id || null,
      title: animalTask.title,
      assignedStaffIds: [], // TODO: pull in staff ids
    }));

    const animalTasksDueSoon = animal.animalTasks.filter((task) => {
      if (!task.dueDate || task.status !== TaskStatus.INCOMPLETE) {
        return false;
      }
      const now = new Date();
      const dueDate = new Date(task.dueDate);

      return (
        dueDate > now && // `dueDate` is in the future
        dueDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000) // `dueDate` is within 24 hours
      );
    });

    const animalTasksOverdue = animal.animalTasks.filter((task) => {
      if (!task.dueDate || task.status !== TaskStatus.INCOMPLETE) {
        return false;
      }
      const now = new Date();
      const dueDate = new Date(task.dueDate);

      return dueDate < now; // `dueDate` is in the past
    });

    const animalTasksDaily = animal.animalTasks.filter((animalTask) => {
      if (animalTask.status !== TaskStatus.INCOMPLETE) {
        return false;
      }

      let dueDate;
      const now = new Date();

      if (!animalTask.task.dueDate) {
        // If dueDate is not provided, set it to today at midnight
        dueDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999
        );
      } else {
        dueDate = new Date(animalTask.task.dueDate);
      }

      if (animalTask.task.dueTime) {
        const [hours, minutes] = animalTask.task.dueTime.split(":").map(Number); // Extract hours and minutes from dueTime string
        dueDate.setHours(hours, minutes, 0, 0);
      } else {
        // Default to midnight if dueTime is not provided
        dueDate.setHours(23, 59, 59, 999);
      }

      // Get midnight today
      const midnightToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      );

      return (
        dueDate > now && // `dueDate` is in the future
        dueDate <= midnightToday // `dueDate` is end of day
      );
    });

    const events = animal.events.map((event: AnimalEvent) => ({
      ...event,
    }));

    return {
      ...animal,
      imageSrcs: animal.imageSrcs || [],
      primaryImageSrc: animal.primaryImageSrc || undefined,
      animalTasksDueSoon,
      animalTasksOverdue,
      animalTasksDaily,
      outcomeDate: animal.outcomeDate || undefined,
      outcomeCategory: animal.outcomeCategory || undefined,
      animalTasks: tasks,
      assignedStaffIds: [],
      intakeDate: animal.intakeDate ? new Date(animal.intakeDate) : undefined,
      dateOfBirth: animal.dateOfBirth
        ? new Date(animal.dateOfBirth)
        : undefined,
      outcomeNotes: animal.outcomeNotes || undefined,
    };
  },

  createAnimal: async (
    shelterId: string,
    userId: string,
    animal: Omit<
      AnimalDTO,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "shelter"
      | "events"
      | "behaviorItems"
      | "medicalItems"
    >
  ): Promise<Animal> => {
    const tasks = await taskService.getAllTasks(shelterId);
    const { currentLocation, ...animalData } = animal;

    const assignedTasks = tasks?.filter((task) =>
      task.assignment?.includes(TaskAssignment.ALL_ANIMALS)
    );

    // TODO: Add species specific tasks

    return prisma.animal.create({
      data: {
        ...animalData,
        createdAt: new Date(),
        updatedAt: new Date(),
        dateOfBirth: animal.dateOfBirth ? new Date(animal.dateOfBirth) : "",
        intakeDate: animal.intakeDate ? new Date(animal.intakeDate) : undefined,
        primaryImageSrc: animal.primaryImageSrc,
        locationId: animal.currentLocation?.id || null,
        animalTasks: {
          create: assignedTasks.map((task) => ({
            title: task.title,
            status: TaskStatus.INCOMPLETE,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            task: {
              connect: {
                id: task.id,
              },
            },
          })),
        },
        shelterId,
      },
    });
  },

  updateAnimal: async (
    userId: string,
    updatedAnimal: Omit<AnimalDTO, "createdAt" | "updatedAt" | "location">
  ): Promise<AnimalDTO | null> => {
    try {
      const {
        id,
        animalTasks,
        events,
        shelterId,
        shelter,
        animalTasksDueSoon,
        animalTasksOverdue,
        animalTasksDaily,
        locationId,
        currentLocation,
        assignedStaffIds, // TODO: wire up with staff assignment
        ...animalData
      } = updatedAnimal;

      const updated = await prisma.animal.update({
        where: { id },
        data: {
          ...animalData,
          locationId: currentLocation?.id || null,
          careStatus: animalData?.careStatus || undefined,
          animalTasks: animalTasks
            ? {
                updateMany: animalTasks.map((animalTask) => ({
                  where: { animalId: id, taskId: animalTask.task.id },
                  data: {
                    status: animalTask.status,
                    staffId: animalTask.staffId,
                    dueDate: animalTask.dueDate
                      ? new Date(animalTask.dueDate)
                      : undefined,
                    completedByUserId:
                      animalTask.status === TaskStatus.COMPLETED
                        ? userId
                        : undefined,
                    lastUpdatedByUserId: userId,
                  },
                })),
              }
            : undefined,
          events: events
            ? {
                updateMany: events.map((event) => ({
                  where: { id: event.id },
                  data: {
                    title: event.title,
                    date: event.date,
                  },
                })),
              }
            : undefined,
          behaviorItems: undefined,
          medicalItems: undefined,
        },
        include: {
          shelter: true,
          animalTasks: {
            include: {
              task: {
                include: {
                  userTasks: true,
                },
              },
              staff: true,
            },
          },
          events: true,
          behaviorItems: true,
        },
      });

      return {
        ...updated,
        animalTasks: updated.animalTasks.map((animalTask) => ({
          task: {
            ...animalTask.task,
            assignedStaffIds: animalTask.task.userTasks.map(
              (userTask) => userTask.userId
            ),
            assignmentCategories: animalTask.task.assignment || [],
            assignmentAnimalIds: [],
            assignedRoles: [],
          },
          staffName: animalTask.staff?.name || null,
          status: animalTask.status,
          staffId: animalTask.staff?.id || null,
          title: animalTask.title,
          dueDate: animalTask.dueDate || undefined,
          assignedStaffIds: animalTask.task.userTasks.map(
            (userTask) => userTask.userId
          ),
        })),
        events: updated.events.map((event) => ({
          ...event,
        })),
        primaryImageSrc: updated.primaryImageSrc || undefined,
        imageSrcs: updated.imageSrcs || [],
        intakeDate: updated.intakeDate
          ? new Date(updated.intakeDate)
          : undefined,
        dateOfBirth: updated.dateOfBirth
          ? new Date(updated.dateOfBirth)
          : undefined,
        outcomeNotes: updated.outcomeNotes || undefined,
        outcomeDate: updated.outcomeDate || undefined,
        outcomeCategory: updated.outcomeCategory || undefined,
        assignedStaffIds: [], // TODO: Add actual assignments
        animalTasksDueSoon: updated.animalTasks.filter((task) => {
          if (!task.dueDate || task.status !== TaskStatus.INCOMPLETE) {
            return false;
          }
          const now = new Date();
          const dueDate = new Date(task.dueDate);
          return (
            dueDate > now && // `dueDate` is in the future
            dueDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000) // `dueDate` is within 24 hours
          );
        }),
        animalTasksOverdue: updated.animalTasks.filter((task) => {
          if (!task.dueDate || task.status !== TaskStatus.INCOMPLETE) {
            return false;
          }
          const now = new Date();
          const dueDate = new Date(task.dueDate);

          return dueDate < now; // `dueDate` is in the past
        }),
        animalTasksDaily: updated.animalTasks.filter((animalTask) => {
          if (animalTask.status !== TaskStatus.INCOMPLETE) {
            return false;
          }

          let dueDate;
          const now = new Date();

          if (!animalTask.task.dueDate) {
            // If dueDate is not provided, set it to today at midnight
            dueDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              23,
              59,
              59,
              999
            );
          } else {
            dueDate = new Date(animalTask.task.dueDate);
          }

          if (animalTask.task.dueTime) {
            const [hours, minutes] = animalTask.task.dueTime
              .split(":")
              .map(Number); // Extract hours and minutes from dueTime string
            dueDate.setHours(hours, minutes, 0, 0);
          } else {
            // Default to midnight if dueTime is not provided
            dueDate.setHours(23, 59, 59, 999);
          }

          // Get midnight today
          const midnightToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59,
            999
          );

          return (
            dueDate > now && // `dueDate` is in the future
            dueDate <= midnightToday // `dueDate` is end of day
          );
        }),
      };
    } catch (error) {
      console.error("Error updating animal:", error);
      return null;
    }
  },

  deleteAnimal: async (id: string): Promise<boolean> => {
    await prisma.animal.delete({
      where: { id },
    });

    return true;
  },
};
