import styles from "./AnimalCard.module.css";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import classNames from "classnames";
import Pill from "../Shared/Pill/Pill";
import { AdoptionStatus, TaskStatus } from "@prisma/client";
import { Button, Checkbox, Collapse } from "@mui/material";
import { useRouter } from "next/router";
import { AnimalDTO } from "@/src/models/animals/AnimalDTO";
import { AnimalId } from "../Shared/AnimalId/AnimalId";
import UserDTO from "@/src/models/users/UserDTO";

interface AnimalCardProps {
  animal: AnimalDTO;
  isShowingTasks: boolean;
  onTaskComplete?: (animalID: string, taskID: string) => void;
  onAddAnimalTask?: (animalID: string) => void;
  users?: UserDTO[];
}

const AnimalCard: React.FC<AnimalCardProps> = ({
  animal,
  isShowingTasks,
  onTaskComplete,
  onAddAnimalTask,
  users,
}) => {
  const {
    id: animalID,
    name,
    species,
    breeds,
    dateOfBirth,
    adoptionStatus,
    primaryImageSrc,
    animalTasks: tasks,
  } = animal;

  const router = useRouter();

  const ageInYears = dateOfBirth
    ? new Date().getFullYear() - new Date(dateOfBirth).getFullYear()
    : 0;
  const ageInMonths = dateOfBirth
    ? new Date().getMonth() - new Date(dateOfBirth).getMonth()
    : 0;
  const adjustedAgeInMonths = ageInMonths < 0 ? 12 + ageInMonths : ageInMonths;
  const adjustedAgeInYears = ageInMonths < 0 ? ageInYears - 1 : ageInYears;

  const age = `${adjustedAgeInYears} years, ${adjustedAgeInMonths} months`;
  const defaultAnimalImage =
    "https://0hxeiwauvd9bvaog.public.blob.vercel-storage.com/animalPhotoPlaceholder-fyOfhdRYAeEkbfDtRgswFq70bGeWF3";

  const handleCheckboxChange = (taskId: string) => {
    onTaskComplete?.(animalID, taskId);
  };

  const taskSummaryStatus = tasks?.every(
    (task) => task.status === TaskStatus.COMPLETED
  )
    ? "completed"
    : "incomplete";

  const taskCompletedCount = useMemo(
    () => tasks?.filter((task) => task.status === TaskStatus.COMPLETED).length,
    [tasks]
  );

  const onAnimalCardClick = () => {
    router.push(`/${router.query.shelterId}/animal-details/${animalID}`);
  };

  const getUserName = (userId: string) => {
    const user = users?.find((user) => user.id === userId);
    return user?.preferredName;
  };

  return (
    <div className={styles.card}>
      <div onClick={onAnimalCardClick} className={styles["clickable-area"]}>
        <div
          className={classNames(
            styles["status-bar"],
            styles[taskSummaryStatus]
          )}
        />

        <div className={styles["name-line"]}>
          <div className={styles.name}>{name}</div>
          <div
            className={classNames(
              styles["completed-status"],
              styles[taskSummaryStatus]
            )}
          >{`${taskCompletedCount} / ${tasks?.length}`}</div>
        </div>
        <div className={styles.header}>
          <Image
            src={primaryImageSrc ?? defaultAnimalImage}
            alt={name}
            width={100}
            height={100}
            className={styles.image}
          />
          <div className={styles.info}>
            <AnimalId animalId={animalID} />
            <div className={styles["info-row"]}>
              {species} &middot; {age}
            </div>
            {breeds != null && (
              <div className={styles["info-row"]}>{breeds?.join(", ")}</div>
            )}
            {adoptionStatus && (
              <Pill
                text={adoptionStatus}
                color={
                  adoptionStatus === AdoptionStatus.AVAILABLE
                    ? "green"
                    : adoptionStatus === AdoptionStatus.PENDING
                    ? "yellow"
                    : adoptionStatus === AdoptionStatus.ADOPTED
                    ? "red"
                    : "green"
                }
              />
            )}
          </div>
        </div>
      </div>
      <Collapse in={isShowingTasks}>
        <div className={styles.tasks}>
          {tasks?.map(({ task, staffName, status, completedByUserId }) => {
            const isCompleted = Boolean(status === TaskStatus.COMPLETED);
            return (
              <div key={task.id} className={styles.task}>
                <Checkbox
                  id={`task-checkbox-${animalID}-${task.id}`}
                  onClick={() => handleCheckboxChange(task?.id ?? "")}
                  defaultChecked={status === TaskStatus.COMPLETED}
                  className={styles["checkbox"]}
                />
                <label
                  htmlFor={`task-checkbox-${animalID}-${task.id}`}
                  className={classNames(styles["checkbox-label"], {
                    [styles.completed]: isCompleted,
                  })}
                >
                  <p>{task.title}</p>
                  <p>{getUserName(completedByUserId ?? "")} </p>
                </label>
              </div>
            );
          })}
          <Button onClick={() => onAddAnimalTask?.(animalID)}>Add task</Button>
        </div>
      </Collapse>
    </div>
  );
};

export default AnimalCard;
