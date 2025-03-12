import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "./DashboardPage.module.css";
import NavigationBar from "../NavigationBar/NavigationBar";
import AnimalCard from "../AnimalCard/AnimalCard";
import { TaskStatus } from "@prisma/client";
import { Button } from "@radix-ui/themes";
import AnimalContainer from "@/src/containers/AnimalContainer";
import UserContainer from "@/src/containers/UsersContainer";
import CreateUpdateAnimalModal from "../CreateUpdateAnimalModal/CreateUpdateAnimalModal";
import uploadToBlobStorage from "@/src/utils/uploadToBlobStorage";
import { useMediaQuery } from "@mui/material";
import SkeletonAnimalCard from "../AnimalCard/SkeletonAnimalCard";
import ExpandedIcon from "@mui/icons-material/ExpandMore";
import CollapsedIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import TaskContainer from "@/src/containers/TaskContainer";
import CreateUpdateTaskModal from "../CreateUpdateTaskModal/CreateUpdateTaskModal";
import { CreateOrUpdateTaskDTO } from "@/src/models/tasks/CreateOrUpdateTaskDTO";
import OverviewMetrics from "./OverviewMetrics/OverviewMetrics";
import { AnimalDTO } from "@/src/models/animals/AnimalDTO";
import classNames from "classnames";
import { DashboardFilterTabs } from "./DashboardFilterTabs/DashboardFilterTabs";
import { Snackbar } from "@mui/material";

const DashboardPage: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:720px)");
  const [isCreateAnimalModalOpen, setIsCreateAnimalModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const {
    createTask,
    loading: taskLoading,
    initializeFromRemote: initializeTasksFromRemote,
  } = TaskContainer.useContainer();

  const {
    activeAnimals: animals,
    createAnimal,
    updateAnimal,
    loading: animalLoading,
    errors: animalErrors,
    initializeFromRemote: initializeAnimalsFromRemote,
  } = AnimalContainer.useContainer();

  const { users, initializeFromRemote: initializeUsersFromRemote } =
    UserContainer.useContainer();

  const [tab, setTab] = useState<string>("all");
  const handleSetTab = useCallback((tab: string) => setTab(tab), []);

  const [isShowingTasks, setIsShowingTasks] = useState<boolean>(true);
  const [newAnimalTaskId, setNewAnimalTaskId] = useState<string | undefined>(
    undefined
  );

  const toggleTasks = useCallback(
    () => (isShowingTasks ? setIsShowingTasks(false) : setIsShowingTasks(true)),
    [isShowingTasks]
  );

  useEffect(() => {
    initializeAnimalsFromRemote();
    initializeTasksFromRemote();
    initializeUsersFromRemote();
  }, []);

  const handleCreateAnimal = async (data: AnimalDTO) => {
    // TODO: move this to a service
    try {
      const filename = `animals/${Date.now()}-${data.name.replace(
        /\s+/g,
        "_"
      )}.jpg`;

      let imageUrl = data.primaryImageSrc || "";

      if (data.primaryImageFile) {
        const uploadedImage = await uploadToBlobStorage(
          data.primaryImageFile,
          filename
        );
        imageUrl = uploadedImage?.url || "";
      }

      const animalData = { ...data, primaryImageSrc: imageUrl };
      delete animalData?.primaryImageFile;

      createAnimal(animalData);
    } catch (error) {
      console.error("Failed to create animal:", error);
    }
  };

  const onTaskComplete = async (animalId: string, taskId: string) => {
    const animal = animals.find((animal) => animal.id === animalId);

    if (!animal) {
      return;
    }

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
  };

  const onAddAnimalTask = async (animalID: string) => {
    setNewAnimalTaskId(animalID);
    setIsCreateTaskModalOpen(true);
  };

  const handleCreateTask = async (data: CreateOrUpdateTaskDTO) => {
    return await createTask(data);
  };

  const filteredAnimals = useMemo(() => {
    if (tab === "incomplete") {
      return animals?.filter((animal) =>
        animal?.animalTasks?.some(
          (task) => task.status !== TaskStatus.COMPLETED
        )
      );
    }
    if (tab === "complete") {
      return animals?.filter((animal) =>
        animal?.animalTasks?.every(
          (task) => task.status === TaskStatus.COMPLETED
        )
      );
    }
    if (tab === "due-today") {
      return animals?.filter((animal) => animal?.animalTasksDaily?.length > 0);
    }
    if (tab === "overdue") {
      return animals?.filter(
        (animal) => animal?.animalTasksOverdue?.length > 0
      );
    }
    return animals;
  }, [animals, tab]);

  if (!animals) {
    return <div>No animals, create animal to see them here</div>;
  }

  return (
    <div className={styles.layout}>
      <Snackbar
        open={animalErrors.length > 0}
        autoHideDuration={3000}
        message={`Error: ${animalErrors}`}
      />
      <NavigationBar selectedAppId="dashboard" secondaryTitle="Daily Rounds" />
      <div className={styles.content}>
        <div className={styles.header}>
          <DashboardFilterTabs
            isLoading={animalLoading}
            selectedTab={tab}
            animals={animals}
            handleSetTab={handleSetTab}
          />

          <div className={styles["header-right"]}>
            {!isMobile && (
              <Fragment>
                <OverviewMetrics isLoading={animalLoading} animals={animals} />
                <div className={styles.divider} />
              </Fragment>
            )}
            <div className={styles["header-right-action-buttons"]}>
              <Button
                onClick={toggleTasks}
                color={"gray"}
                className={classNames({ [styles["small-button"]]: isMobile })}
              >
                {isShowingTasks ? <ExpandedIcon /> : <CollapsedIcon />}
                {!isMobile && (isShowingTasks ? "Hide tasks" : "Show tasks")}
              </Button>
              <Button
                onClick={() => setIsCreateAnimalModalOpen(true)}
                className={classNames({ [styles["small-button"]]: isMobile })}
              >
                <AddIcon />
                {!isMobile && "Add animal"}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.animals}>
          {animalLoading ? (
            <SkeletonAnimalCard />
          ) : animals.length === 0 ? (
            <div className={styles["zero-state"]}>
              No animals, create animal to see them here.
            </div>
          ) : (
            filteredAnimals?.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                isShowingTasks={isShowingTasks}
                onTaskComplete={(animalId, taskId) =>
                  onTaskComplete(animalId, taskId)
                }
                onAddAnimalTask={() => onAddAnimalTask(animal.id)}
                users={users}
              />
            ))
          )}
        </div>
        <CreateUpdateAnimalModal
          onSubmit={(data) => {
            handleCreateAnimal(data);
            setIsCreateAnimalModalOpen(false);
          }}
          isOpen={isCreateAnimalModalOpen}
          setIsOpen={setIsCreateAnimalModalOpen}
        />

        <CreateUpdateTaskModal
          onSubmit={(data) => {
            handleCreateTask(data);
            setIsCreateTaskModalOpen(false);
          }}
          isOpen={isCreateTaskModalOpen}
          setIsOpen={setIsCreateTaskModalOpen}
          assignmentAnimalIds={newAnimalTaskId ? [newAnimalTaskId] : []}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
