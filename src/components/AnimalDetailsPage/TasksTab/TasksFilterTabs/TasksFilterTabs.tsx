import { TaskStatus } from "@prisma/client";
import React, { useMemo } from "react";
import { TabData, Tabs } from "../../../Tabs/Tabs";
import { AnimalDTO } from "../../../../models/animals/AnimalDTO";

export function TasksFilterTabs({
  isLoading,
  handleSetTab,
  selectedTab,
  animal,
}: {
  isLoading: boolean;
  handleSetTab: (tab: string) => void;
  selectedTab: string;
  animal: AnimalDTO;
}) {
  const numIncompleteTasks = useMemo(() => {
    return (
      animal?.animalTasks?.filter(
        (task) => task.status !== TaskStatus.COMPLETED
      ).length || 0
    );
  }, [animal]);

  const numCompleteTasks = useMemo(() => {
    return (
      animal?.animalTasks?.filter(
        (task) => task.status === TaskStatus.COMPLETED
      ).length || 0
    );
  }, [animal]);

  const numTasksDueSoon = useMemo(() => {
    return animal?.animalTasksDueSoon?.length || 0;
  }, [animal]);

  const numTasksOverdue = useMemo(() => {
    return animal?.animalTasksOverdue?.length || 0;
  }, [animal]);

  const numTasksDueToday = useMemo(() => {
    return animal?.animalTasksDaily?.length || 0;
  }, [animal]);

  const relevantTabData: TabData[] = useMemo(() => {
    return [
      {
        tabName: "All tasks",
        tabId: "all",
        tabCount: animal?.animalTasks?.length || 0,
        isLoading,
      },
      {
        tabName: "Incomplete",
        tabId: "incomplete",
        tabCount: numIncompleteTasks,
        isLoading,
      },
      {
        tabName: "Complete",
        tabId: "complete",
        tabCount: numCompleteTasks,
      },
      {
        tabName: "Due today",
        tabId: "due-today",
        tabCount: numTasksDueSoon,
      },
      {
        tabName: "Overdue",
        tabId: "overdue",
        tabCount: numTasksOverdue,
      },
      { tabName: "Due today", tabId: "daily", tabCount: numTasksDueToday },
    ];
  }, [animal, isLoading, numIncompleteTasks]);

  return (
    <Tabs
      selectedTab={selectedTab}
      handleSetTab={handleSetTab}
      tabData={relevantTabData}
    />
  );
}
