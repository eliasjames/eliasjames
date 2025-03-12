import React from "react";
import styles from "./TaskManagement.module.css";
import DetailedAnimalTasks from "../../DetailedAnimalTasks/DetailedAnimalTasks";
import AnimalContainer from "@/src/containers/AnimalContainer";

type TaskManagementTabProps = {
  animalId: string;
};

const TaskManagementTab: React.FC<TaskManagementTabProps> = ({ animalId }) => {
  const {
    animals,
    getAllAnimals,
    createAnimal,
    updateAnimal,
    loading: animalLoading,
    errors: animalErrors,
  } = AnimalContainer.useContainer();

  const animal = animals.find((animal) => animal.id === animalId);
  const tasks = animal?.animalTasks;

  return (
    <div className={styles["tasks-container"]}>
      <div className={styles["tasks-list"]}>
        <DetailedAnimalTasks animalTasks={tasks ?? []} />
      </div>
    </div>
  );
};

export default TaskManagementTab;
