import { useRef, useState } from "react";
import { createContainer } from "unstated-next";
import * as tailwindApi from "../api/tailwindApi";
import UserDTO from "@/src/models/users/UserDTO";
import ShelterContainer from "./ShelterContainer";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import PermissionKey from "../models/users/PermissionKey";

function useUserContainer() {
  const session = useSession();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { currentShelter } = ShelterContainer.useContainer();
  const initializeRef = useRef(false);

  const initializeFromRemote = async () => {
    if (initializeRef.current) {
      return; // Prevent multiple calls
    }
    initializeRef.current = true;
    await getAllUsers();
  };

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await tailwindApi.getUsers(currentShelter?.id ?? "");
      if (response) {
        setUsers(response);
      } else {
        setErrors(["Failed to load users"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  const getCurrentShelterUser = () => {
    return users?.find(
      (user: UserDTO) =>
        user.email.toLocaleLowerCase() ===
        session.data?.user?.email?.toLocaleLowerCase()
    );
  };

  const createUser = async (data: UserDTO) => {
    setLoading(true);
    try {
      const response = await tailwindApi.createUser(data);

      if (response) {
        try {
          setUsers([...users, response]);
        } catch (err) {
          console.error("Error in setUsers:", err);
        }
        setLoading(false);
        return response;
      } else {
        setErrors(["Failed to create animal"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  const getUserById = async (id: string) => {
    setLoading(true);
    try {
      const response = await tailwindApi.getUserById(id);
      if (response) {
        setUsers([...users, response]);
      } else {
        setErrors(["Failed to get animal"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
  };

  const updateUser = async (data: UserDTO) => {
    try {
      const response = await tailwindApi.updateUser(data);
      if (response) {
        setUsers((prevUsers) =>
          prevUsers.map((animal) =>
            animal.id === response.id ? response : animal
          )
        );
      } else {
        setErrors(["Failed to update animal"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await tailwindApi.deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((animal) => animal.id !== id));
    } catch (err: any) {
      setErrors([err.message]);
    }
  };
  const hasPermission = (permission: PermissionKey): boolean => {
    if (!getCurrentShelterUser()) return false;
    return getCurrentShelterUser()!.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: PermissionKey[]): boolean => {
    if (!getCurrentShelterUser()) return false;
    return permissions.some((permission) =>
      getCurrentShelterUser()!.permissions.includes(permission)
    );
  };

  const hasAllPermissions = (permissions: PermissionKey[]): boolean => {
    if (!getCurrentShelterUser()) return false;
    return permissions.every((permission) =>
      getCurrentShelterUser()!.permissions.includes(permission)
    );
  };

  const hasRole = (role: Role): boolean => {
    return getCurrentShelterUser()?.role === role || false;
  };

  return {
    initializeFromRemote,
    getAllUsers,
    getCurrentShelterUser,
    users,
    setUsers,
    errors,
    setErrors,
    loading,
    setLoading,
    createUser,
    updateUser,
    getUserById,
    deleteUser,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  };
}

export default createContainer(useUserContainer);
