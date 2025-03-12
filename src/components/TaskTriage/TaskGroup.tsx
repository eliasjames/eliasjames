import React from "react";
import styles from "./TaskGroup.module.css";
import { Task, TaskStatus } from "@prisma/client";
import { Checkbox, Skeleton } from "@mui/material";
import { AnimalDTO } from "@/src/models/animals/AnimalDTO";
import classNames from "classnames";
import Image from "next/image";
import { AnimalTaskDTO } from "@/src/models/animals/AnimalTaskDTO";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TaskContainer from "@/src/containers/TaskContainer";
import { GroupByOption } from "./TaskTriagePage";

interface EnrichedTask {
  animal: AnimalDTO;
  task: AnimalTaskDTO;
}

const STATUS_DISPLAY_MAP = {
  [TaskStatus.COMPLETED]: "Complete",
  [TaskStatus.IN_PROGRESS]: "In progress",
  [TaskStatus.INCOMPLETE]: "To do",
};

const STATUS_STYLE_MAP = {
  [TaskStatus.COMPLETED]: "complete",
  [TaskStatus.IN_PROGRESS]: "in-progress",
  [TaskStatus.INCOMPLETE]: "incomplete",
};

const GROUP_BY_OPTION_TO_DISPLAY_NAME = {
  "animal-location": "No location recorded",
  "task-location": "No location recorded",
  species: "No species recorded",
  "task-type": "No task type recorded",
};

export function ParentTaskGroup({
  taskGroupId,
  primaryGroupBy,
  groupDisplayNameLookup,
  taskGroups,
  handleCheckboxChange,
  defaultAnimalImage,
  isMobile,
  loading,
}: {
  taskGroupId: string;
  primaryGroupBy: GroupByOption;
  groupDisplayNameLookup: { [groupId: string]: string | undefined } | undefined;
  taskGroups: { [task: string]: EnrichedTask[] };
  handleCheckboxChange: (taskId: string, animal: AnimalDTO) => void;
  defaultAnimalImage: string;
  isMobile: boolean;
  loading?: boolean;
}) {
  const { tasks, initializeFromRemote: initializeTasksFromRemote } =
    TaskContainer.useContainer();

  const allTasks = Object.values(taskGroups).flatMap((taskGroup) =>
    Object.values(taskGroup)
  );

  const completedTaskCount = allTasks.filter(
    (enrichedTask) => enrichedTask.task.status === "COMPLETED"
  ).length;

  const isSectionComplete = completedTaskCount === allTasks.length;

  return (
    <div className={styles["primary-task-group"]}>
      <div
        className={classNames(styles["primary-task-group-title"], {
          [styles.complete]: isSectionComplete,
        })}
      >
        <div className={styles.left}>
          {taskGroupId == "null" || taskGroupId == "undefined"
            ? GROUP_BY_OPTION_TO_DISPLAY_NAME[primaryGroupBy]
            : groupDisplayNameLookup?.[taskGroupId] ??
              taskGroupId ??
              "Untitled"}
        </div>
        <div
          className={classNames(styles.status, {
            [styles.complete]: isSectionComplete,
          })}
        >
          {completedTaskCount} / {allTasks.length} complete
          {isSectionComplete ? (
            <CheckCircleIcon
              fontSize="inherit"
              className={styles["status-icon"]}
            />
          ) : (
            <WarningIcon fontSize="inherit" className={styles["status-icon"]} />
          )}
        </div>
      </div>

      {loading ? (
        <SkeletonTaskGroup isMobile={isMobile} />
      ) : allTasks.length === 0 ? (
        <div className={styles["zero-state"]}>No tasks found.</div>
      ) : (
        Object.entries(taskGroups).map(([taskId, animalTasks]) => {
          const taskMetadata = tasks.find((task) => task.id === taskId);
          return (
            <TaskGroup
              key={taskId}
              taskMetadata={taskMetadata}
              tasks={animalTasks}
              handleCheckboxChange={handleCheckboxChange}
              defaultAnimalImage={defaultAnimalImage}
              isMobile={isMobile}
            />
          );
        })
      )}
    </div>
  );
}

export function TaskGroup({
  taskMetadata,
  tasks,
  handleCheckboxChange,
  defaultAnimalImage,
  isMobile,
}: {
  taskMetadata: Task | undefined;
  tasks: EnrichedTask[];
  handleCheckboxChange: (taskId: string, animal: AnimalDTO) => void;
  defaultAnimalImage: string;
  isMobile: boolean;
}) {
  const completedTaskCount = tasks.filter(
    (enrichedTask) => enrichedTask.task.status === "COMPLETED"
  ).length;

  const isSectionComplete = completedTaskCount === tasks.length;
  return (
    <div className={styles["task-group"]}>
      <div className={styles["task-group-title"]}>
        <div className={styles.left}>
          {taskMetadata?.title ?? "Untitled task"}
          {!!taskMetadata?.dueTime && (
            <div className={styles["info-tag"]}>
              Due by {taskMetadata?.dueTime}
            </div>
          )}
        </div>

        <div
          className={classNames(styles.status, {
            [styles.complete]: isSectionComplete,
          })}
        >
          {completedTaskCount} / {tasks.length ?? 0} complete
          {isSectionComplete ? (
            <CheckCircleIcon
              fontSize="inherit"
              className={styles["status-icon"]}
            />
          ) : (
            <WarningIcon fontSize="inherit" className={styles["status-icon"]} />
          )}
        </div>
      </div>
      <div className={styles.tasks}>
        {tasks.map((enrichedTask) => {
          return (
            <TaskRow
              key={enrichedTask.animal.id + "-" + enrichedTask.task.task.id}
              enrichedTask={enrichedTask}
              handleCheckboxChange={handleCheckboxChange}
              defaultAnimalImage={defaultAnimalImage}
              isChecked={enrichedTask.task.status === TaskStatus.COMPLETED}
              isMobile={isMobile}
            />
          );
        })}
      </div>
    </div>
  );
}

function TaskRow({
  enrichedTask,
  handleCheckboxChange,
  defaultAnimalImage,
  isChecked,
  isMobile,
}: {
  enrichedTask: EnrichedTask;
  handleCheckboxChange: (taskId: string, animal: AnimalDTO) => void;
  defaultAnimalImage: string;
  isChecked: boolean;
  isMobile: boolean;
}) {
  return (
    <div
      key={enrichedTask.task.task.id}
      className={classNames(styles["task-row"], {
        [styles.completed]: isChecked,
      })}
    >
      <Checkbox
        id={`task-checkbox-${enrichedTask.animal.id}-${enrichedTask.task.task.id}`}
        onClick={() =>
          handleCheckboxChange(
            enrichedTask.task.task?.id ?? "",
            enrichedTask.animal
          )
        }
        defaultChecked={enrichedTask.task.status === TaskStatus.COMPLETED}
        className={styles["checkbox"]}
      />
      <Image
        src={enrichedTask.animal.primaryImageSrc ?? defaultAnimalImage}
        alt={enrichedTask.animal.name}
        width={30}
        height={30}
        className={styles.image}
      />
      <div className={styles["animal-name"]}>{enrichedTask.animal.name}</div>
      {!isMobile && (
        <div
          className={classNames(
            styles["task-status"],
            styles[STATUS_STYLE_MAP[enrichedTask.task.status]]
          )}
        >
          {STATUS_DISPLAY_MAP[enrichedTask.task.status]}
        </div>
      )}
      <div className={styles["task-name"]}>
        {enrichedTask.task.task.description}
      </div>
      {!isMobile && (
        <div
          className={classNames(styles["due-date"], {
            [styles.inactive]: enrichedTask.task.dueDate == null,
          })}
        >
          {enrichedTask.task.dueDate?.toISOString()}
        </div>
      )}
    </div>
  );
}

export function SkeletonTaskGroup({ isMobile }: { isMobile: boolean }) {
  return (
    <div className={styles["task-group"]}>
      <div className={styles["task-group-title"]}>
        <div className={styles.left}>
          <Skeleton height={24} width={120} />
          <Skeleton
            className={styles["info-tag"]}
            height={29}
            width={80}
            variant="rounded"
          />
        </div>

        <div className={styles.status}>
          <Skeleton height={24} width={80} />
          <Skeleton
            className={styles["status-icon"]}
            height={24}
            width={24}
            variant="rounded"
          />
        </div>
      </div>
      <div className={styles.tasks}>
        <SkeletonTaskRow isMobile={isMobile} />
        <SkeletonTaskRow isMobile={isMobile} />
        <SkeletonTaskRow isMobile={isMobile} />
      </div>
    </div>
  );
}

function SkeletonTaskRow({ isMobile }: { isMobile: boolean }) {
  return (
    <div className={styles["task-row"]}>
      <Checkbox defaultChecked={false} className={styles["checkbox"]} />
      <Skeleton height={30} width={30} variant={"rounded"} />
      <Skeleton className={styles["animal-name"]} height={16} width={80} />
      {!isMobile && (
        <Skeleton className={styles["task-status"]} height={16} width={70} />
      )}
      <Skeleton className={styles["task-name"]} height={16} width={60} />
      {!isMobile && (
        <Skeleton className={styles["due-date"]} height={16} width={80} />
      )}
    </div>
  );
}
