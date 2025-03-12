import { TaskStatus } from "@prisma/client";
import React, { useMemo } from "react";
import styles from "./RemainingTaskSummary.module.css";
import { AnimalTaskDTO } from "@/src/models/animals/AnimalTaskDTO";
import { AnimalDTO } from "@/src/models/animals/AnimalDTO";
import classNames from "classnames";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Skeleton } from "@mui/material";

interface TaskOverviewMetricsProps {
  tasks: { task: AnimalTaskDTO; animal: AnimalDTO }[] | undefined;
  isLoading: boolean;
}

const RemainingTaskSummary: React.FC<TaskOverviewMetricsProps> = ({
  isLoading,
  tasks,
}) => {
  if (tasks == null && !isLoading) {
    return null;
  }

  const completedTasks = useMemo(
    () =>
      tasks?.filter((task) => task.task.status === TaskStatus.COMPLETED)
        .length ?? 0,
    [tasks]
  );

  const totalTasks = useMemo(() => tasks?.length ?? 0, [tasks?.length]);
  const showIcon = useMemo(
    () => completedTasks === totalTasks,
    [completedTasks, totalTasks]
  );

  return isLoading ? (
    <Skeleton className={styles.metric} height={24} width={84} />
  ) : (
    <div
      className={classNames(styles.metric, {
        [styles.complete]: completedTasks === totalTasks,
        [styles["not-started"]]: completedTasks === 0 && totalTasks > 0,
        [styles["incomplete"]]:
          completedTasks > 0 && totalTasks > 0 && completedTasks < totalTasks,
        [styles["no-data"]]: completedTasks === 0 && totalTasks === 0,
      })}
    >
      {showIcon && <CheckCircleIcon className={styles.icon} />}
      {totalTasks - completedTasks} remaining
    </div>
  );
};

export default RemainingTaskSummary;
