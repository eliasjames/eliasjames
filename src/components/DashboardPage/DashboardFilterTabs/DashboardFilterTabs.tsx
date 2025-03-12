import { TaskStatus } from "@prisma/client";
import React, { useMemo } from "react";
import { TabData, Tabs } from "../../Tabs/Tabs";
import { AnimalDTO } from "../../../models/animals/AnimalDTO";

export function DashboardFilterTabs({
  isLoading,
  handleSetTab,
  selectedTab,
  animals,
}: {
  isLoading: boolean;
  handleSetTab: (tab: string) => void;
  selectedTab: string;
  animals: AnimalDTO[];
}) {
  const numAnimalsWithIncompleteTasks = useMemo(() => {
    return (
      animals?.filter((animal) =>
        animal?.animalTasks?.some(
          (task) => task.status !== TaskStatus.COMPLETED
        )
      ).length || 0
    );
  }, [animals]);

  const numAnimalsWithCompleteTasks = useMemo(() => {
    return (
      animals?.filter((animal) =>
        animal?.animalTasks?.every(
          (task) => task.status === TaskStatus.COMPLETED
        )
      ).length || 0
    );
  }, [animals]);

  const numAnimalsWithTasksDueToday = useMemo(() => {
    return (
      animals?.filter((animal) => animal?.animalTasksDaily?.length > 0)
        .length || 0
    );
  }, [animals]);

  const numAnimalsWithTasksOverdue = useMemo(() => {
    return (
      animals?.filter((animal) => animal?.animalTasksOverdue?.length > 0)
        .length || 0
    );
  }, [animals]);

const relevantTabData: TabData[] = useMemo(() => {
    return [
      {
        tabName: "All animals",
        tabId: "all",
        tabCount: animals?.length,
        isLoading,
      },
      {
        tabName: "Incomplete",
        tabId: "incomplete",
        tabCount: numAnimalsWithIncompleteTasks,
        isLoading,
      },
      {
        tabName: "Complete",
        tabId: "complete",
        tabCount: numAnimalsWithCompleteTasks,
      },
      {
        tabName: "Due today",
        tabId: "due-today",
        tabCount: numAnimalsWithTasksDueToday,
      },
      {
        tabName: "Overdue",
        tabId: "overdue",
        tabCount: numAnimalsWithTasksOverdue,
      },
    ];
  }, [animals, isLoading, numAnimalsWithIncompleteTasks]);

  return (
    <Tabs
      selectedTab={selectedTab}
      handleSetTab={handleSetTab}
      tabData={relevantTabData}
    />
  );
}
