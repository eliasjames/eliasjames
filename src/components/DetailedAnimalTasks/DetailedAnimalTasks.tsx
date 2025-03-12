import React from "react";
import styles from "./DetailedAnimalTasks.module.css";
import { AnimalTaskDTO } from "../../models/animals/AnimalTaskDTO";
import TaskCard from "../TaskCard/TaskCard";
import { on } from "events";

export type DetailedAnimalTasksProps = {
  animalTasks: AnimalTaskDTO[];
  onDelete?: () => void;
  onClick?: () => void;
};

const DetailedAnimalTasks: React.FC<DetailedAnimalTasksProps> = ({
  animalTasks,
  onDelete,
  onClick,
}) => {
  return (
    <div className={styles.taskList}>
      {animalTasks.map((animalTask) => (
        <TaskCard
          task={animalTask.task}
          onDelete={() => onDelete?.()}
        />
      ))}
    </div>
  );
};

export default DetailedAnimalTasks;
