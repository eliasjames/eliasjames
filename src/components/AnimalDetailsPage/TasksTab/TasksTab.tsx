import React, { useCallback, useMemo, useState } from "react";
import styles from "./Tasks.module.css";
import AnimalContainer from "../../../containers/AnimalContainer";
import { Task, TaskStatus } from "@prisma/client";
import { Button, Checkbox } from "@mui/material";
import classNames from "classnames";
import { AnimalTaskDTO } from "../../../models/animals/AnimalTaskDTO";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TasksFilterTabs } from "./TasksFilterTabs/TasksFilterTabs";

type TasksTabProps = {
  animalId: string;
};

const TasksTab: React.FC<TasksTabProps> = ({ animalId }) => {
  const {
    animals,
    updateAnimal,
    loading: animalLoading,
    errors: animalErrors,
  } = AnimalContainer.useContainer();

  const [tab, setTab] = useState<string>("all");
  const handleSetTab = useCallback((tab: string) => setTab(tab), []);

  const animal = animals.find((animal) => animal.id === animalId);
  const tasks = animal?.animalTasks;

  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(
    (tasks ?? []).reduce((acc, { task, status }) => {
      acc[task?.id ?? ""] = Boolean(status === TaskStatus.COMPLETED);
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleCheckboxChange = (taskId: string) => {
    setCheckedTasks((prevChecked) => ({
      ...prevChecked,
      [taskId]: !prevChecked[taskId],
    }));

    if (animal) {
      const updatedTasks = animal.animalTasks.map((animalTask) => {
        if (animalTask.task.id === taskId) {
          return {
            ...animalTask,
            status:
              animalTask.status === TaskStatus.COMPLETED
                ? TaskStatus.INCOMPLETE
                : TaskStatus.COMPLETED,
          };
        }
        return animalTask;
      });

      const updatedAnimal = {
        ...animal,
        animalTasks: updatedTasks,
      };

      updateAnimal(updatedAnimal);
    }
  };

  const groupedTasks: Record<string, AnimalTaskDTO[]> = {};

  // Iterate over tasks and assign them to the appropriate groups based on their types
  tasks?.forEach((animalTask) => {
    animalTask.task.type.forEach((taskType) => {
      if (!groupedTasks[taskType]) {
        groupedTasks[taskType] = [];
      }
      groupedTasks[taskType].push(animalTask);
    });

    if (animalTask.task.type.length < 1) {
      if (!groupedTasks["Other"]) {
        groupedTasks["Other"] = [];
      }
      groupedTasks["Other"].push(animalTask);
    }
  });

  const filteredGroupedTasks: Record<string, AnimalTaskDTO[]> = useMemo(() => {
    if (tab === "all") {
      return groupedTasks;
    }

    if (tab === "incomplete") {
      return Object.fromEntries(
        Object.entries(groupedTasks)
          .map(([type, tasks]) => [
            type,
            tasks.filter((task) => task.status !== TaskStatus.COMPLETED),
          ])
          .filter(([, tasks]) => tasks.length > 0)
      );
    }

    if (tab === "complete") {
      return Object.fromEntries(
        Object.entries(groupedTasks)
          .map(([type, tasks]) => [
            type,
            tasks.filter((task) => task.status === TaskStatus.COMPLETED),
          ])
          .filter(([, tasks]) => tasks.length > 0)
      );
    }

    if (tab === "daily") {
      return Object.fromEntries(
        Object.entries(groupedTasks)
          .map(([type, tasks]) => [
            type,
            tasks.filter((task) =>
              (animal?.animalTasksDaily ?? []).some(
                (dailyTask) => dailyTask.taskId === task.task.id
              )
            ),
          ])
          .filter(([, tasks]) => tasks.length > 0)
      );
    }

    if (tab === "overdue") {
      return Object.fromEntries(
        Object.entries(groupedTasks)
          .map(([type, tasks]) => [
            type,
            tasks.filter((task) =>
              (animal?.animalTasksOverdue ?? []).some(
                (overdueTask) => overdueTask.taskId === task.task.id
              )
            ),
          ])
          .filter(([, tasks]) => tasks.length > 0)
      );
    }

    return groupedTasks;
  }, [groupedTasks, tab]);

  if (!animal) {
    return null;
  }

  return (
    <div className={styles["tasks-container"]} id="tasks">
      <TasksFilterTabs
        handleSetTab={handleSetTab}
        animal={animal}
        isLoading={false}
        selectedTab={tab}
      />
      {Object.entries(filteredGroupedTasks).map(([type, tasksOfType]) => (
        <div key={type} className={styles.section}>
          <div className={styles["section-header"]}>{type}</div>
          <div className={styles["section-content"]}>
            {tasksOfType.map(({ task, staffName, status }) => {
              const isCompleted = Boolean(status === TaskStatus.COMPLETED);
              return (
                <div key={task.id} className={styles.task}>
                  <Checkbox
                    id={`task-checkbox-${animalId}-${task.id}`}
                    onClick={() => handleCheckboxChange(task?.id ?? "")}
                    defaultChecked={status === TaskStatus.COMPLETED}
                    className={styles["checkbox"]}
                  />
                  <label
                    htmlFor={`task-checkbox-${animalId}-${task.id}`}
                    className={classNames(styles["checkbox-label"], {
                      [styles.completed]: isCompleted,
                    })}
                  >
                    <p>{task.title}</p>
                    {task.dueDate ? (
                      <p>{new Date(task.dueDate).toLocaleDateString()}</p>
                    ) : null}
                    <p>{staffName}</p>
                  </label>
                  <Button>{<MoreVertIcon />}</Button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TasksTab;
