import { useRef, useState } from "react";
import * as tailwindApi from "../api/tailwindApi";
import { Task } from "@prisma/client";
import { createContainer } from "unstated-next";
import AnimalContainer from "./AnimalContainer";
import { CreateOrUpdateTaskDTO } from "../models/tasks/CreateOrUpdateTaskDTO";
import ShelterContainer from "./ShelterContainer";

function useTaskContainer() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const animalsContainer = AnimalContainer.useContainer();
  const { currentShelter } = ShelterContainer.useContainer();
  const initializeRef = useRef(false);

  const initializeFromRemote = async () => {
    if (initializeRef.current) {
      return; // Prevent multiple calls
    }
    initializeRef.current = true;
    getAllTasks();
  };

  const getAllTasks = async () => {
    setLoading(true);
    try {
      const response = await tailwindApi.getTasks(currentShelter?.id ?? "");
      if (tasks) {
        setTasks(response);
      } else {
        setErrors(["Failed to load tasks"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    setLoading(false);
  };

  const createTask = async (data: CreateOrUpdateTaskDTO) => {
    setLoading(true);
    let newTask: Task;
    try {
      const response = await tailwindApi.createTask(
        currentShelter?.id ?? "",
        data
      );
      if (response) {
        setTasks([...tasks, response]);
        newTask = response as Task;
        // return response;
      } else {
        setErrors(["Failed to create task"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    // reload animals to get animal tasks
    animalsContainer.getAllAnimals();

    getAllTasks();
    setLoading(false);
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    try {
      const response = await tailwindApi.deleteTask(
        currentShelter?.id ?? "",
        id
      );
      if (response) {
        setTasks(tasks.filter((task) => task.id !== id));
      } else {
        setErrors(["Failed to delete task"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }

    // reload animals to get animal tasks
    animalsContainer.getAllAnimals();

    setLoading(false);
  };

  const updateTask = async (data: CreateOrUpdateTaskDTO) => {
    setLoading(true);
    try {
      const response = await tailwindApi.updateTask(
        currentShelter?.id ?? "",
        data
      );
      if (response) {
        setTasks(tasks.map((task) => (task.id === data.id ? response : task)));
      } else {
        setErrors(["Failed to update task"]);
      }
    } catch (err: any) {
      setErrors([err.message]);
    }
    getAllTasks();
    setLoading(false);
  };

  return {
    initializeFromRemote,
    getAllTasks,
    tasks,
    setTasks,
    errors,
    setErrors,
    loading,
    setLoading,
    createTask,
    deleteTask,
    updateTask,
  };
}

export default createContainer(useTaskContainer);
