import prisma from "../lib/prisma";
import { LocationDTO } from "../models/locations/LocationDTO";

export const locationService = {
  getAllLocations: async (shelterId: string): Promise<LocationDTO[]> => {
    const locations = await prisma.location.findMany({
      where: {
        shelterId,
      },
    });

    return locations.map((location) => mapLocation(location));
  },

  getLocationById: async (id: string): Promise<LocationDTO> => {
    const location = await prisma.location.findUnique({
      where: {
        id,
      },
    });

    return mapLocation(location);
  },

  createLocation: async (
    shelterId: string,
    data: LocationDTO
  ): Promise<LocationDTO> => {
    const { currentAnimals, locationTasksDueSoon, ...rest } = data;
    const location = await prisma.location.create({
      data: {
        ...rest,
        shelterId,
        capacity: data.capacity.toString(),
      },
    });

    return mapLocation(location);
  },

  updateLocation: async (data: LocationDTO): Promise<LocationDTO> => {
    const {
      id: locationId,
      currentAnimals,
      locationTasksDueSoon,
      ...rest
    } = data;

    const location = await prisma.location.update({
      where: {
        id: locationId,
      },
      data: {
        ...rest,
        capacity: data.capacity.toString(),
      },
    });

    return mapLocation(location);
  },

  deleteLocation: async (id: string): Promise<Boolean> => {
    const location = await prisma.location.delete({
      where: {
        id,
      },
    });

    return true;
  },
};

const mapLocation = (location: any): LocationDTO => {
  return {
    id: location.id,
    name: location.name,
    type: location.type,
    createdAt: location.createdAt,
    updatedAt: location.updatedAt,
    capacity: location.capacity,
    currentAnimals: location.currentAnimals,
    locationTasksDueSoon: location.locationTasksDueSoon,
  };
};
