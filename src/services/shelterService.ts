import prisma from "../lib/prisma";
import { CreateOrUpdateShelterDTO } from "../models/shelters/CreateOrUpdateShelterDTO";
import CreateUpdateShelterUserInviteDTO from "../models/shelters/CreateUpdateShelterUserInvite";
import permissionsList from "@/src/constants/permissions.json";

export const shelterService = {
  getAllShelters: async (userId: string) => {
    const shelterUsers = await prisma.shelterUser.findMany({
      where: {
        userId,
      },
      include: {
        shelter: true,
        user: true,
      },
    });
    return shelterUsers.map((shelterUser) => shelterUser.shelter);
  },
  getShelterById: async (id: string) => {
    const shelter = await prisma.shelter.findUnique({
      where: { id },
      include: {
        shelterUsers: true,
      },
    });
    return shelter;
  },

  createShelter: async (userId: string, data: CreateOrUpdateShelterDTO) => {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      throw new Error("User does not exist");
    }

    return prisma.$transaction(async (prisma) => {
      const adminRole = await prisma.role.findFirst({
        where: {
          name: "ADMIN",
        },
      });

      let newAdminRole;
      if (!adminRole) {
        // Create the Admin role if it doesn't exist
        newAdminRole = await prisma.role.create({
          data: {
            name: "ADMIN",
          },
        });
      }

      // Create the shelter with the admin role
      const newShelter = await prisma.shelter.create({
        data: {
          name: data.name,
          addressLine1: data.addressLine1 ?? "",
          addressLine2: data.addressLine2,
          city: data.city ?? "",
          state: data.state ?? "",
          country: data.country ?? "",
          zipCode: data.zipCode ?? "",
          phone: data.phone,
          email: data.email,
          shelterRoles: {
            create: {
              role: {
                connect: {
                  id: adminRole ? adminRole.id : newAdminRole?.id ?? "",
                },
              },
            },
          },
        },
        include: {
          shelterRoles: {
            include: {
              role: true,
            },
          },
        },
      });

      const shelterRoleId = newShelter.shelterRoles?.[0].id;

      if (!shelterRoleId) {
        throw new Error("Shelter role ID could not be retrieved");
      }

      const validShelterRole = await prisma.shelterRole.findUnique({
        where: { id: shelterRoleId },
      });

      if (!validShelterRole) {
        throw new Error(`ShelterRole with ID ${shelterRoleId} does not exist`);
      }

      // Create the shelter user with the admin role
      await prisma.shelterUser.create({
        data: {
          userId,
          shelterId: newShelter.id,
          roleId:
            newShelter.shelterRoles.find((role) => role.role.name === "ADMIN")
              ?.role.id ?? "",
          permissions: permissionsList.permissions.map(
            (permission: { key: string; label: string }) => permission.key
          ),
        },
      });

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          shelterId: newShelter.id,
        },
      });

      return {
        shelter: newShelter,
        user: updatedUser,
      };
    });
  },

  getAllShelterUserInvites: async (id: string) => {
    const shelterUserInvites = await prisma.shelterUserInvite.findMany({
      where: {
        shelterId: id,
      },
      include: {
        shelterUser: true,
      },
    });
    return shelterUserInvites;
  },

  createShelterUserInvite: async (
    shelterId: string,
    data: CreateUpdateShelterUserInviteDTO
  ) => {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return await prisma.shelterUser.create({
        data: {
          userId: existingUser.id,
          shelterId,
          permissions: data.permissions,  
        },
      });
    } else {
      const shelterUserInvite = await prisma.shelterUserInvite.create({
        data: {
          shelterId: shelterId,
          ...data,
        },
      });
      return shelterUserInvite;
    }
  },

  deleteShelterUserInvite: async (shelterId: string, email: string) => {
    const existingInvite = await prisma.shelterUserInvite.findFirst({
      where: {
        shelterId,
        email,
      },
    });

    if (!existingInvite) {
      throw new Error("Shelter user invite not found.");
    }

    return await prisma.shelterUserInvite.delete({
      where: {
        shelterId_email: {
          shelterId,
          email,
        },
      },
    });
  },
};
