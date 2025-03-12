import prisma from "../lib/prisma";
import UserDTO from "../models/users/UserDTO";
import { hash } from "bcrypt";

// TODO: Update types

export const userService = {
  getUserById: async (id: string): Promise<UserDTO> => {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        userTasks: {
          include: {
            task: true,
          },
        },
        shelters: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return mapWithShelterUser(user as any);
  },

  getAllUsers: async (shelterId: string): Promise<UserDTO[]> => {
    const users = await prisma.user.findMany({
      where: {
        shelterUsers: {
          some: {
            shelterId: shelterId,
          },
        },
      },
      include: {
        userTasks: {
          include: {
            task: true,
          },
        },
        shelterUsers: {
          include: {
            shelter: true,
            user: true,
          },
        },
      },
    });

    return users.map((user) => mapWithShelterUser(user as any));
  },

  createUser: async (
    data: Omit<
      UserDTO,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "userTasks"
      | "shelterUsers"
      | "shelters"
    >
  ): Promise<
    Omit<
      UserDTO,
      "userTasks" | "shelterUsers" | "shelters" | "shelterId" | "password"
    >
  > => {
    const { password, email, ...newData } = data;

    // Check if the email already exists in your database
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        shelterUsers: true,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash the password and save the new user
    const hashedPassword = await hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const createdUser = await prisma.user.create({
      data: {
        ...newData,
        ...newUser,
        preferredName: data.preferredName || data.firstName,
      },
      include: {
        shelterUsers: true,
      },
    });

    const pendingInvites = await prisma.shelterUserInvite.findMany({
      where: {
        email,
      },
    });

    if (pendingInvites.length) {
      await prisma.$transaction(
        pendingInvites.flatMap((invite) => [
          prisma.shelterUser.create({
            data: {
              user: {
                connect: {
                  email,
                },
              },
              shelter: {
                connect: {
                  id: invite.shelterId,
                },
              },
              permissions: invite.permissions,
              isAdmin: invite.isAdmin,
              isStaff: invite.isStaff,
              isVolunteer: invite.isVolunteer,
            },
          }),
          prisma.user.update({
            where: {
              email,
            },
            data: {
              shelterId: invite.shelterId,
            },
          }),
        ])
      );

      await prisma.shelterUserInvite.deleteMany({
        where: {
          email,
        },
      });
    }
    return createdUser as any;
  },

  updateUser: async (
    shelterUserId: string,
    updatedUser: UserDTO
  ): Promise<UserDTO> => {
    const { ...newData } = updatedUser;

    const updatedShelterUser = await prisma.shelterUser.update({
      where: {
        id: shelterUserId,
      },
      data: {
        permissions: newData.permissions,
        isAdmin: newData.isAdmin,
        isStaff: newData.isStaff,
        isVolunteer: newData.isVolunteer,
      },
    });

    if (!updatedShelterUser) {
      throw new Error("User not found");
    }

    return mapWithShelterUser(updatedShelterUser as any);
  },

  deleteUser: async (id: string): Promise<boolean> => {
    await prisma.shelterUser.delete({
      where: {
        id,
      },
    });

    return true;
  },
};

const mapWithShelterUser = (user: UserDTO) => {
  const shelterUser = user.shelterUsers?.find((shelterUser) => {
    return shelterUser.shelterId === user.shelterId;
  });

  return { ...user, ...shelterUser };
};
