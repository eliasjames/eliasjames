import { useEffect, useRef, useState } from "react";
import { createContainer } from "unstated-next";
import * as tailwindApi from "../api/tailwindApi";
import { CreateOrUpdateShelterDTO } from "../models/shelters/CreateOrUpdateShelterDTO";
import { useRouter } from "next/router";
import CreateUpdateShelterUserInviteDTO from "../models/shelters/CreateUpdateShelterUserInvite";
import { useSession } from "next-auth/react";

function useShelterContainer() {
  const [shelters, setShelters] = useState<CreateOrUpdateShelterDTO[]>([]);
  const [currentShelter, setCurrentShelter] = useState<
    CreateOrUpdateShelterDTO | undefined
  >(undefined);
  const [currentShelterUsers, setCurrentShelterUsers] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(false);
  const [shelterInvites, setShelterInvites] = useState<any[]>([]);
  const router = useRouter();
  const session = useSession();
  const initializeRef = useRef(false);

  const initializeFromRemote = async () => {
    if (initializeRef.current) {
      return; // Prevent multiple calls
    }
    initializeRef.current = true;
    setInitializing(true);
    await getAllShelters();
    setInitializing(false);
  };

  const { shelterId } = router.query;
  useEffect(() => {
    // get shelter id from route and update current shelter
    if (shelterId) {
      const shelter = shelters?.find((shelter) => shelter.id === shelterId);

      setCurrentShelter(shelter);
    }
  }, [shelterId, shelters, router.isReady]);

  const getAllShelters = async () => {
    setLoading(true);
    try {
      const response = await tailwindApi.getShelters();
      if (response) {
        setShelters(response);
      } else {
        setErrors(["Failed to load shelters"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  const getCurrentShelterUser = () => {
    const user = currentShelterUsers.find(
      (user) => user.email === session.data?.user?.email
    );
    return user;
  };

  const getShelterById = async () => {
    setLoading(true);
    try {
      const response = await tailwindApi.getShelterById(
        shelterId?.toString() ?? ""
      );
      if (response) {
        setCurrentShelter(response);
        return response;
      } else {
        setErrors(["Failed to load shelter"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  const createShelter = async (data: CreateOrUpdateShelterDTO) => {
    setLoading(true);
    try {
      const response = await tailwindApi.createShelter(data);
      if (response) {
        setShelters(response);
      } else {
        setErrors(["Failed to create shelter"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  const getAllShelterUserInvites = async () => {
    setLoading(true);
    try {
      const response = await tailwindApi.getShelterUserInvites(
        shelterId?.toString() ?? ""
      );
      if (response) {
        setShelterInvites(response);
      } else {
        setErrors(["Failed to load shelter user invites"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  const deleteShelterUserInvite = async (email: string) => {
    setLoading(true);
    try {
      const response = await tailwindApi.deleteShelterUserInvite(
        currentShelter?.id ?? "",
        email
      );
      if (response) {
        setShelterInvites((prevInvites) =>
          prevInvites.filter((invite) => invite.email !== email)
        );
      } else {
        setErrors(["Failed to delete shelter user invite"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  const createShelterUserInvite = async (
    data: CreateUpdateShelterUserInviteDTO
  ) => {
    setLoading(true);
    try {
      const response = await tailwindApi.createShelterUserInvite(
        currentShelter?.id ?? "",
        { ...data }
      );
      if (response) {
        setShelterInvites((prevInvites) => [...prevInvites, response]);
      } else {
        setErrors(["Failed to create shelter user invite"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  const updateShelterUser = async (
    userId: string,
    data: CreateUpdateShelterUserInviteDTO
  ) => {
    setLoading(true);
    try {
      const response = await tailwindApi.updateShelterUser(
        currentShelter?.id ?? "",
        userId,
        { ...data }
      );
      if (response) {
        setCurrentShelterUsers(response);
      } else {
        setErrors(["Failed to update shelter user"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  const deleteShelterUser = async (userId: string) => {
    setLoading(true);
    try {
      const response = await tailwindApi.deleteShelterUser(
        currentShelter?.id ?? "",
        userId
      );
      if (response) {
        setCurrentShelterUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );
      } else {
        setErrors(["Failed to delete shelter user"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  return {
    shelters,
    errors,
    loading,
    getAllShelters,
    createShelter,
    initializeFromRemote,
    currentShelter,
    initializing,
    getShelterById,
    getAllShelterUserInvites,
    createShelterUserInvite,
    shelterInvites,
    currentShelterUsers,
    updateShelterUser,
    deleteShelterUser,
    deleteShelterUserInvite,
    getCurrentShelterUser,
  };
}

export default createContainer(useShelterContainer);
