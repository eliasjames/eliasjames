import styles from "./AnimalCard.module.css";
import React from "react";
import classNames from "classnames";
import { Skeleton } from "@mui/material";
import { AnimalDTO } from "@/src/models/animals/AnimalDTO";

interface AnimalCardProps {
  animal: AnimalDTO;
  onTaskComplete?: (animalId: string, taskId: string) => void;
}

const SkeletonAnimalCard: React.FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles["clickable-area"]}>
        <div className={classNames(styles["status-bar"], styles["no-data"])} />

        <div className={styles["name-line"]}>
          <Skeleton className={styles.name} height={36} width={64} />
          <Skeleton
            className={styles["completed-status"]}
            height={36}
            width={50}
          />
        </div>
        <div className={styles.header}>
          <Skeleton
            className={styles.image}
            variant={"rounded"}
            height={100}
            width={100}
          />
          <div className={styles.info}>
            <Skeleton className={styles["animal-id"]} height={24} width={120} />
            <Skeleton className={styles["info-row"]} height={24} width={50} />

            <div className={styles["info-row"]}>
              <Skeleton className={styles["info-row"]} height={24} width={80} />

              <Skeleton className={styles["info-row"]} height={24} width={30} />
            </div>
            <Skeleton className={styles["info-row"]} height={29} width={84} />
          </div>
        </div>
      </div>
      <div className={styles.tasks}>
        <SkeletonTask />
        <SkeletonTask />
        <SkeletonTask />
      </div>
    </div>
  );
};

function SkeletonTask() {
  return (
    <div className={styles.task}>
      <Skeleton
        variant="rounded"
        height={20}
        width={20}
        className={styles["checkbox"]}
      />
      <label className={styles["checkbox-label"]}>
        <Skeleton height={20} width={100} />
        <Skeleton height={20} width={60} />
      </label>
    </div>
  );
}

export default SkeletonAnimalCard;
