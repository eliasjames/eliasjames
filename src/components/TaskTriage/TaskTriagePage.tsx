import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./TaskTriagePage.module.css";
import NavigationBar from "../NavigationBar/NavigationBar";
import { TaskStatus } from "@prisma/client";
import AnimalContainer from "@/src/containers/AnimalContainer";
import {
  Button,
  Popover,
  Snackbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import TaskContainer from "@/src/containers/TaskContainer";
import { AnimalDTO } from "@/src/models/animals/AnimalDTO";
import RemainingTaskSummary from "./RemainingTaskSummary";
import { groupBy, sortBy } from "lodash";
import { AnimalTaskDTO } from "@/src/models/animals/AnimalTaskDTO";
import { useSession } from "next-auth/react";
import { ParentTaskGroup, SkeletonTaskGroup, TaskGroup } from "./TaskGroup";
import { TaskFilters } from "./TaskFilters";
import SettingsIcon from "@mui/icons-material/Settings";
import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { styled } from "@mui/system";
import { MenuButton as BaseMenuButton } from "@mui/base/MenuButton";
import { MenuItem as BaseMenuItem, menuItemClasses } from "@mui/base/MenuItem";
import LocationContainer from "@/src/containers/LocationContainer";

export type GroupByOption =
  | "animal-location"
  | "task-location"
  | "species"
  | "task-type";

interface EnrichedTask {
  animal: AnimalDTO;
  task: AnimalTaskDTO;
}

const DashboardPage: React.FC = () => {
  const session = useSession();
  const user = session.data?.user;
  const isMobile = useMediaQuery("(max-width:720px)");

  const { tasks, initializeFromRemote: initializeTasksFromRemote } =
    TaskContainer.useContainer();

  const { locations, initializeFromRemote: initializeLocationsFromRemote } =
    LocationContainer.useContainer();

  const {
    animals,
    getAllAnimals,
    updateAnimal,
    loading: animalLoading,
    errors: animalErrors,
    initializeFromRemote: initializeAnimalsFromRemote,
  } = AnimalContainer.useContainer();

  const enrichedAnimalTasks = useMemo(
    () =>
      animals
        ?.map((animal) =>
          animal.animalTasks?.map((task) => {
            return { animal, task };
          })
        )
        .flat(),
    [animals]
  );

  const [myTaskFilter, setMyTaskFilter] = useState<boolean>(false);
  const [incompleteTaskFilter, setIncompleteTaskFilter] =
    useState<boolean>(false);
  const toggleTaskFilter = useCallback(() => {
    setMyTaskFilter(!myTaskFilter);
  }, [myTaskFilter]);
  const toggleIncompleteFilter = useCallback(() => {
    setIncompleteTaskFilter(!incompleteTaskFilter);
  }, [incompleteTaskFilter]);

  useEffect(() => {
    initializeAnimalsFromRemote();
    initializeTasksFromRemote();
    initializeLocationsFromRemote();
  }, []);

  const defaultAnimalImage =
    "https://0hxeiwauvd9bvaog.public.blob.vercel-storage.com/animalPhotoPlaceholder-fyOfhdRYAeEkbfDtRgswFq70bGeWF3";

  const handleCheckboxChange = useCallback(
    (taskId: string, animal: AnimalDTO) => {
      onTaskComplete?.(animal, taskId);
    },
    []
  );

  const onTaskComplete = async (animal: AnimalDTO, taskId: string) => {
    if (!animal) {
      console.error("Failed to update task. No animal provided.");
      return;
    }

    const updatedTasks = animal.animalTasks?.map((animalTask) => {
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
  };

  // Refetch animals when new task is created
  useEffect(() => {
    getAllAnimals(); // TODO: Shouldn't have to do this with containers, look into state updates
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const filtered = enrichedAnimalTasks?.filter((task) => {
      const isMyTask =
        myTaskFilter && user?.id
          ? task.task.assignedStaffIds.includes(user?.id)
          : true;
      const isIncomplete = incompleteTaskFilter
        ? task.task.status !== TaskStatus.COMPLETED
        : true;
      return isMyTask && isIncomplete;
    });

    return sortBy(filtered, (enrichedTask) => [
      enrichedTask.task.task.dueTime,
      enrichedTask.task.task.id,
      enrichedTask.animal.name,
    ]);
  }, [enrichedAnimalTasks, myTaskFilter, incompleteTaskFilter]);

  const [primaryGroupBy, setPrimaryGroupBy] =
    useState<GroupByOption>("task-type");

  const groupedTasks: { [groupId: string]: EnrichedTask[] } = useMemo(() => {
    if (primaryGroupBy === "task-location") {
      return groupBy(
        filteredTasks,
        (enrichedTask) => enrichedTask.task.task.locationsIds
      );
    } else if (primaryGroupBy === "animal-location") {
      return groupBy(
        filteredTasks,
        (enrichedTask) => enrichedTask.animal.locationId
      );
    } else if (primaryGroupBy === "species") {
      return groupBy(
        filteredTasks,
        (enrichedTask) => enrichedTask.animal.species
      );
    } else {
      return { ["All tasks"]: filteredTasks };
    }
  }, [filteredTasks, primaryGroupBy]);

  const groupDisplayNameLookup:
    | {
        [groupId: string]: string | undefined;
      }
    | undefined = useMemo(() => {
    if (primaryGroupBy === "task-type" || primaryGroupBy === "species") {
      return undefined;
    } else if (
      primaryGroupBy === "animal-location" ||
      primaryGroupBy === "task-location"
    ) {
      const locationLookup: { [locationId: string]: string | undefined } = {};
      Object.keys(groupedTasks).forEach((locationId) => {
        locationLookup[locationId] = locations.find(
          (location) => location.id === locationId
        )?.name;
      });
      return locationLookup;
    }
  }, [filteredTasks, primaryGroupBy, locations]);

  const groupedTasksByType = useMemo(() => {
    const groups: {
      [group: string]: {
        [taskId: string]: {
          animal: AnimalDTO;
          task: AnimalTaskDTO;
        }[];
      };
    } = {};

    Object.keys(groupedTasks).forEach((group) => {
      groups[group] = groupBy(
        groupedTasks[group],
        (enrichedTask) => enrichedTask.task.task.id
      );
    });

    return groups;
  }, [groupedTasks]);

  return (
    <div className={styles.layout}>
      <Snackbar
        open={animalErrors.length > 0}
        autoHideDuration={3000}
        message={`Error: ${animalErrors}`}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <NavigationBar selectedAppId="task-triage" secondaryTitle="Task Triage" />
      <div className={styles.content}>
        <div className={styles.header}>
          <TaskFilters
            myTaskFilter={myTaskFilter}
            incompleteTaskFilter={incompleteTaskFilter}
            toggleTaskFilter={toggleTaskFilter}
            toggleIncompleteFilter={toggleIncompleteFilter}
            filteredTasks={filteredTasks}
            userId={user?.id}
            isLoading={animalLoading}
          />
          <div className={styles["header-right"]}>
            {!isMobile && (
              <RemainingTaskSummary
                isLoading={animalLoading}
                tasks={filteredTasks}
              />
            )}

            <Dropdown>
              <MenuButton>
                <SettingsIcon style={{ color: "#f58220" }} />
              </MenuButton>
              <Menu slots={{ listbox: Listbox }}>
                <MenuItem onClick={() => setPrimaryGroupBy("task-type")}>
                  Group by task type
                </MenuItem>
                <MenuItem onClick={() => setPrimaryGroupBy("animal-location")}>
                  Group by animal location
                </MenuItem>
                <MenuItem onClick={() => setPrimaryGroupBy("species")}>
                  Group by species
                </MenuItem>
                <MenuItem onClick={() => setPrimaryGroupBy("task-location")}>
                  Group by task location
                </MenuItem>
              </Menu>
            </Dropdown>
          </div>
        </div>
        <div className={styles["scrollable-content"]}>
          {!enrichedAnimalTasks?.length && !animalLoading && (
            <div className={styles["zero-state"]}>
              No tasks, create tasks in the Task Management app to see them here
            </div>
          )}

          {animalLoading && animals == null && (
            <SkeletonTaskGroup isMobile={isMobile} />
          )}

          {groupedTasksByType != null &&
            Object.entries(groupedTasksByType)?.map(
              ([group, taskTypeGroups]) => {
                return (
                  <ParentTaskGroup
                    key={group}
                    taskGroupId={group}
                    primaryGroupBy={primaryGroupBy}
                    groupDisplayNameLookup={groupDisplayNameLookup}
                    taskGroups={taskTypeGroups}
                    handleCheckboxChange={handleCheckboxChange}
                    defaultAnimalImage={defaultAnimalImage}
                    isMobile={isMobile}
                    loading={animalLoading && animals == null}
                  />
                );
              }
            )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

const blue = {
  50: "#F0F7FF",
  100: "#C2E0FF",
  200: "#99CCF3",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E6",
  700: "#0059B3",
  800: "#004C99",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Listbox = styled("ul")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  box-shadow: 0 4px 30px ${
    theme.palette.mode === "dark" ? grey[900] : grey[200]
  };
  z-index: 1;

  .closed & {
    opacity: 0;
    transform: scale(0.95, 0.8);
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }
  
  .open & {
    opacity: 1;
    transform: scale(1, 1);
    transition: opacity 100ms ease-out, transform 100ms cubic-bezier(0.43, 0.29, 0.37, 1.48);
  }

  .placement-top & {
    transform-origin: bottom;
  }

  .placement-bottom & {
    transform-origin: top;
  }
  `
);

const MenuItem = styled(BaseMenuItem)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  user-select: none;

  &:last-of-type {
    border-bottom: none;
  }

  &:focus {
    outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : blue[200]};
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }

  &.${menuItemClasses.disabled} {
    color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  }
  `
);

const MenuButton = styled(BaseMenuButton)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 8px 8px 5px 8px;
  border-radius: 8px;
  transition: all 150ms ease;
  cursor: pointer;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  &:hover {
    background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
  }

  &:active {
    background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${
      theme.palette.mode === "dark" ? blue[300] : blue[200]
    };
    outline: none;
  }
  `
);
