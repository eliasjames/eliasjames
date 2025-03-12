import React, { useMemo } from "react";
import styles from "./TaskFilters.module.css";
import { TaskStatus } from "@prisma/client";
import { Skeleton } from "@mui/material";
import { AnimalDTO } from "@/src/models/animals/AnimalDTO";
import classNames from "classnames";
import { AnimalTaskDTO } from "@/src/models/animals/AnimalTaskDTO";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FilterPill } from "../Shared/FilterPill/FilterPill";

interface EnrichedTask {
  animal: AnimalDTO;
  task: AnimalTaskDTO;
}

export function TaskFilters({
  myTaskFilter,
  incompleteTaskFilter,
  toggleTaskFilter,
  toggleIncompleteFilter,
  filteredTasks,
  userId,
  isLoading,
}: {
  myTaskFilter: boolean;
  incompleteTaskFilter: boolean;
  toggleTaskFilter: () => void;
  toggleIncompleteFilter: () => void;
  filteredTasks: EnrichedTask[];
  userId: string | undefined;
  isLoading: boolean;
}) {
  const incompleteTaskCount = useMemo(
    () =>
      filteredTasks.filter(({ task }) => task.status !== TaskStatus.COMPLETED)
        .length ?? 0,
    [filteredTasks]
  );

  const myTaskCount = useMemo(
    () =>
      userId == null
        ? 0
        : filteredTasks.filter(({ task }) =>
            task.assignedStaffIds.includes(userId)
          ).length ?? 0,
    [filteredTasks]
  );

  return (
    <div className={styles.filters}>
      <div className={styles["filter-title"]}>
        <FilterAltIcon fontSize="inherit" />
        Filters
      </div>
      <FilterPill
        title="My tasks"
        count={myTaskCount}
        isActive={myTaskFilter}
        onClick={toggleTaskFilter}
        isLoading={isLoading}
      />
      <FilterPill
        title="Incomplete"
        count={incompleteTaskCount}
        isActive={incompleteTaskFilter}
        onClick={toggleIncompleteFilter}
        isLoading={isLoading}
      />
    </div>
  );
}
