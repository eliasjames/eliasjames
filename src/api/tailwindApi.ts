import { CreateOrUpdateTaskDTO } from "../models/tasks/CreateOrUpdateTaskDTO";
import { AnimalDTO } from "../models/animals/AnimalDTO";
import UserDTO from "../models/users/UserDTO";
import { CreateOrUpdateShelterDTO } from "../models/shelters/CreateOrUpdateShelterDTO";
import CreateUpdateShelterUserInviteDTO from "../models/shelters/CreateUpdateShelterUserInvite";
import { LocationDTO } from "../models/locations/LocationDTO";

// Animals

export async function getAnimals(shelterId: string) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/animals`);
    if (!response.ok) {
      throw new Error("Failed to fetch animals");
    }
    const animals = await response.json();
    return animals;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function getAnimalById(shelterId: string, id: string) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/animals/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch animal");
    }
    const animal = await response.json();
    return animal;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function createAnimal(shelterId: string, animal: AnimalDTO) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/animals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(animal),
    });
    if (!response.ok) {
      throw new Error("Failed to create animal");
    }
    const createdAnimal = await response.json();
    return createdAnimal;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function updateAnimal(shelterId: string, animal: AnimalDTO) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(
      `/api/shelters/${shelterId}/animals/${animal.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(animal),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update animal");
    }
    const updatedAnimal = await response.json();
    return updatedAnimal;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function deleteAnimal(shelterId: string, id: string) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/animals/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete animal");
    }
    return true;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

// Tasks

export async function getTasks(shelterId: string) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/tasks`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function createTask(
  shelterId: string,
  task: CreateOrUpdateTaskDTO
) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error("Failed to create task");
    }
    const createdTask = await response.json();
    return createdTask;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function deleteTask(shelterId: string, id: string) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
    return true;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function updateTask(
  shelterId: string,
  task: CreateOrUpdateTaskDTO
) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(
      `/api/shelters/${shelterId}/tasks/${task.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update task");
    }
    const updatedTask = await response.json();
    return updatedTask;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

// Users

export async function getUsers(shelterId: string) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/users`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function createUser(user: UserDTO) {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    const createdUser = await response.json();
    return createdUser;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function getUserById(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function updateUser(user: UserDTO) {
  try {
    const response = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function deleteUser(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    return true;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

// Shelters

export async function getShelters() {
  try {
    const response = await fetch("/api/shelters");
    if (!response.ok) {
      throw new Error("Failed to fetch shelters");
    }
    const shelters = await response.json();
    return shelters;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function getShelterById(shelterId: string) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch shelter");
    }
    const shelter = await response.json();
    return shelter;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function createShelter(shelter: CreateOrUpdateShelterDTO) {
  try {
    const response = await fetch("/api/shelters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shelter),
    });
    if (!response.ok) {
      throw new Error("Failed to create shelter");
    }
    const createdShelter = await response.json();
    return createdShelter;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

// Shelter Invites

export async function getShelterUserInvites(shelterId: string) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/invites`);
    if (!response.ok) {
      throw new Error("Failed to fetch shelter user invites");
    }
    const invites = await response.json();
    console.log({ invites });
    return invites;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function createShelterUserInvite(
  shelterId: string,
  data: CreateUpdateShelterUserInviteDTO
) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/invites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create shelter user invite");
    }
    const invites = await response.json();
    return invites;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function deleteShelterUserInvite(
  shelterId: string,
  email: string
) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/invites/`, {
      method: "DELETE",
      body: email,
    });
    if (!response.ok) {
      throw new Error("Failed to delete shelter user invite");
    }
    return true;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function updateShelterUser(
  shelterId: string,
  userId: string,
  data: CreateUpdateShelterUserInviteDTO
) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update shelter user");
    }
    const invites = await response.json();
    return invites;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function deleteShelterUser(shelterId: string, userId: string) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/users/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete shelter user");
    }
    return true;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

// Locations

export async function getLocations(shelterId: string) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/locations`, {
      headers: { "Cache-Control": "no-cache" },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }
    const locations = await response.json();
    return locations;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function createLocation(shelterId: string, location: LocationDTO) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });
    if (!response.ok) {
      throw new Error("Failed to create location");
    }
    const createdLocation = await response.json();
    return createdLocation;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function getLocationById(shelterId: string, id: string) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/locations/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch location");
    }
    const location = await response.json();
    return location;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function updateLocation(shelterId: string, location: LocationDTO) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(
      `/api/shelters/${shelterId}/locations/${location.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update location");
    }
    const updatedLocation = await response.json();
    return updatedLocation;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}

export async function deleteLocation(shelterId: string, id: string) {
  if (!shelterId) {
    return;
  }
  try {
    const response = await fetch(`/api/shelters/${shelterId}/locations/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete location");
    }
    return true;
  } catch (error) {
    console.error(error);
    // Handle error
  }
}
