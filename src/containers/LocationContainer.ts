import { useRef, useState } from "react";
import { createContainer } from "unstated-next";
import * as tailwindApi from "../api/tailwindApi";
import { LocationDTO } from "../models/locations/LocationDTO";
import { useRouter } from "next/router";

function useLocationContainer() {
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const shelterId = router.query.shelterId as string;
  const initializeRef = useRef(false);

  const initializeFromRemote = async () => {
    if (initializeRef.current) {
      return; // Prevent multiple calls
    }
    initializeRef.current = true;
    await getAllLocations();
  };

  const getAllLocations = async () => {
    setLoading(true);
    try {
      const response = await tailwindApi.getLocations(shelterId ?? "");
      if (locations) {
        setLocations(response);
      } else {
        setErrors(["Failed to load locations"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  const createLocation = async (data: LocationDTO) => {
    setLoading(true);
    try {
      const response = await tailwindApi.createLocation(shelterId ?? "", data);
      if (response) {
        setLocations([...locations, response]);
      } else {
        setErrors(["Failed to create location"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    getAllLocations();
    setLoading(false);
  };

  const getLocationById = async (id: string) => {
    setLoading(true);
    try {
      const response = await tailwindApi.getLocationById(shelterId ?? "", id);
      if (response) {
        setLocations([...locations, response]);
      } else {
        setErrors(["Failed to get location"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
  };

  const updateLocation = async (data: LocationDTO) => {
    try {
      const response = await tailwindApi.updateLocation(shelterId ?? "", data);
      if (response) {
        setLocations((prevLocations) =>
          prevLocations.map((location) =>
            location.id === response.id ? response : location
          )
        );
      } else {
        setErrors(["Failed to update location"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      await tailwindApi.deleteLocation(shelterId ?? "", id);
      setLocations((prevLocations) =>
        prevLocations.filter((location) => location.id !== id)
      );
    } catch (err: any) {
      setErrors([err.message]);
    }
    getAllLocations();
  };

  return {
    initializeFromRemote,
    getAllLocations,
    locations,
    setLocations,
    errors,
    setErrors,
    loading,
    setLoading,
    createLocation,
    updateLocation,
    getLocationById,
    deleteLocation,
  };
}

export default createContainer(useLocationContainer);
