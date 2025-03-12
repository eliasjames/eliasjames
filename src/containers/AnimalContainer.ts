import { useRef, useState } from "react";
import { createContainer } from "unstated-next";
import * as tailwindApi from "../api/tailwindApi";
import { AnimalDTO } from "../models/animals/AnimalDTO";
import { useRouter } from "next/router";
import { CareStatus } from "@prisma/client";

function useAnimalContainer() {
  const [animals, setAnimals] = useState<AnimalDTO[]>([]);
  const [activeAnimals, setActiveAnimals] = useState<AnimalDTO[]>([]);
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
    await getAllAnimals();
  };

  const getAllAnimals = async () => {
    setLoading(true);
    try {
      const response = await tailwindApi.getAnimals(shelterId ?? "");
      if (animals) {
        setAnimals(response);
        setActiveAnimals(
          response.filter(
            (animal: AnimalDTO) => animal.careStatus === CareStatus.ACTIVE
          )
        );
      } else {
        setErrors(["Failed to load animals"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  const createAnimal = async (data: AnimalDTO) => {
    setLoading(true);
    try {
      const response = await tailwindApi.createAnimal(shelterId ?? "", data);
      if (response) {
        setAnimals([...animals, response]);
      } else {
        setErrors(["Failed to create animal"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    getAllAnimals();
    setLoading(false);
  };

  const getAnimalById = async (id: string) => {
    setLoading(true);
    try {
      const response = await tailwindApi.getAnimalById(shelterId ?? "", id);
      if (response) {
        setAnimals([...animals, response]);
      } else {
        setErrors(["Failed to get animal"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
  };

  const updateAnimal = async (data: AnimalDTO) => {
    try {
      const response = await tailwindApi.updateAnimal(shelterId ?? "", data);
      if (response) {
        setAnimals((prevAnimals) =>
          prevAnimals.map((animal) =>
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

  const deleteAnimal = async (id: string) => {
    try {
      await tailwindApi.deleteAnimal(shelterId ?? "", id);
      setAnimals((prevAnimals) =>
        prevAnimals.filter((animal) => animal.id !== id)
      );
    } catch (err: any) {
      setErrors([err.message]);
    }
    getAllAnimals();
  };

  return {
    initializeFromRemote,
    getAllAnimals,
    animals,
    activeAnimals,
    setAnimals,
    errors,
    setErrors,
    loading,
    setLoading,
    createAnimal,
    updateAnimal,
    getAnimalById,
    deleteAnimal,
  };
}

export default createContainer(useAnimalContainer);
