import styles from "./AnimalDetailsPage.module.css";
import AnimalContainer from "@/src/containers/AnimalContainer";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NavigationBar from "../NavigationBar/NavigationBar";
import Pill from "../Shared/Pill/Pill";
import { Button, useMediaQuery } from "@mui/material";
import TasksTab from "./TasksTab/TasksTab";
import DetailsTab from "./DetailsTab/DetailsTab";
import TaskManagementTab from "./TaskManagementTab/TaskManagementTab";
import UnassignedTasksTab from "./UnassignedTasksTab/UnassignedTasksTab";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AnimalDTO } from "@/src/models/animals/AnimalDTO";
import CreateUpdateAnimalModal from "../CreateUpdateAnimalModal/CreateUpdateAnimalModal";
import uploadToBlobStorage from "@/src/utils/uploadToBlobStorage";
import { AnimalId } from "../Shared/AnimalId/AnimalId";
import SkeletonAnimalDetailsPage from "./SkeletonAnimalDetailsPage";
import classNames from "classnames";
import { AdoptionStatus, Animal, CareStatus } from "@prisma/client";
import EditCareStatusModal from "../EditCareStatusModal/EditCareStatusModal";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import AddOutcomeModal from "../AddOutcomeModal/AddOutcomeModal";

const AnimalDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState<
    "editTasks" | "tasks" | "details" | "unassignedTasks"
  >("details");
  const [isEditAnimalModalOpen, setIsEditAnimalModalOpen] = useState(false);
  const [isEditCareStatusModalOpen, setIsEditCareStatusModalOpen] =
    useState(false);
  const [isPromptProcessOutcomeModalOpen, setPromptProcessOutcomeModalOpen] =
    useState(false);
  const [isAddOutcomeModalOpen, setIsAddOutcomeModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    animals,
    updateAnimal,
    deleteAnimal,
    loading: animalsLoading,
    initializeFromRemote: initializeAnimalsFromRemote,
  } = AnimalContainer.useContainer();
  const defaultAnimalImage =
    "https://0hxeiwauvd9bvaog.public.blob.vercel-storage.com/animalPhotoPlaceholder-fyOfhdRYAeEkbfDtRgswFq70bGeWF3";

  useEffect(() => {
    // TODO: don't load all animals - just te one by id from API
    initializeAnimalsFromRemote();
  }, [id]);
  const animal = animals?.find((animal) => animal.id === id);

  if (!animal && !!router.isReady && !animalsLoading) {
    return <div>Animal not found.</div>;
  }

  const onEditSubmit = async (data: AnimalDTO) => {
    try {
      const updatedAnimal = {
        ...animal,
        ...data,
        intakeDate: data.intakeDate
          ? new Date(data.intakeDate)
          : animal?.intakeDate,
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth)
          : animal?.dateOfBirth,
        outcomeDate: data.outcomeDate
          ? new Date(data.outcomeDate)
          : animal?.outcomeDate,
      };
      if (data.primaryImageFile) {
        const filename = `animals/${Date.now()}-${updatedAnimal.name.replace(
          /\s+/g,
          "_"
        )}.jpg`;
        const uploadedImage = await uploadToBlobStorage(
          data.primaryImageFile,
          filename
        );
        updatedAnimal.primaryImageSrc =
          uploadedImage?.url || animal?.primaryImageSrc || "";
      }

      delete updatedAnimal?.primaryImageFile;
      updateAnimal(updatedAnimal);
      setIsEditAnimalModalOpen(false);
    } catch (error) {
      console.error("Failed to update animal:", error);
    }
  };

  if (animalsLoading) {
    return <SkeletonAnimalDetailsPage />;
  }

  if (!animal) {
    return (
      <div className={styles.layout}>
        <NavigationBar />
        <div className={styles["page-layout"]}>
          <div className={styles["page-content"]}>Animal not found.</div>
        </div>
      </div>
    );
  }

  const {
    id: animalId,
    name,
    species,
    breeds,
    dateOfBirth,
    adoptionStatus,
    careStatus,
  } = animal;

  const ageInYears = dateOfBirth
    ? new Date().getFullYear() - new Date(dateOfBirth).getFullYear()
    : 0;
  const ageInMonths = dateOfBirth
    ? new Date().getMonth() - new Date(dateOfBirth).getMonth()
    : 0;
  const adjustedAgeInMonths = ageInMonths < 0 ? 12 + ageInMonths : ageInMonths;
  const adjustedAgeInYears = ageInMonths < 0 ? ageInYears - 1 : ageInYears;

  const age = `${adjustedAgeInYears} years, ${adjustedAgeInMonths} months`;

  const actionButtons = (
    <div className={styles["header-actions-container"]}>
      <Button
        className={styles["action-button"]}
        onClick={() => setIsEditAnimalModalOpen(true)}
      >
        <ModeEditIcon />
        Edit
      </Button>

      <Button
        className={styles["action-button"]}
        onClick={() => {
          deleteAnimal(animal.id);
          router.push("/dashboard");
        }}
      >
        <DeleteIcon />
        Delete
      </Button>
    </div>
  );

  const handleCareStatusSubmit = (data: CareStatus) => {
    updateAnimal({ ...animal, careStatus: data });
    setIsEditCareStatusModalOpen(false);

    if (data === "INACTIVE") {
      setPromptProcessOutcomeModalOpen(true);
    }
  };

  return (
    <div className={styles.layout}>
      <NavigationBar />
      <div className={styles["page-layout"]}>
        <div className={styles["page-content"]}>
          <div className={styles["header-container"]}>
            <Image
              src={animal.primaryImageSrc ?? defaultAnimalImage}
              width={200}
              height={200}
              className={styles.image}
              alt={animal.name}
            />
            <div className={styles["heading-content"]}>
              <div className={styles["header-animal-content-container"]}>
                <div className={styles["animal-name"]}>{name}</div>
                <AnimalId animalId={animalId} />
                <div className={styles["info-row"]}>
                  <p>{species}</p>
                  <p>{age}</p>
                </div>
                <div className={styles["info-row"]}>{<p>{breeds?.[0]}</p>}</div>
                <div className={styles["status-row"]}>
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
                  <Pill
                    text={careStatus ? `${careStatus} Care` : ""}
                    color={careStatus === CareStatus.ACTIVE ? "green" : "red"}
                    onEdit={() => setIsEditCareStatusModalOpen(true)}
                  />
                </div>
              </div>
              {isMobile && actionButtons}
              <div className={styles["tabs-container"]}>
                <div
                  className={classNames(styles.tab, {
                    [styles.active]: activeTab === "details",
                  })}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </div>
                <div
                  className={classNames(styles.tab, {
                    [styles.active]: activeTab === "tasks",
                  })}
                  onClick={() => setActiveTab("tasks")}
                >
                  Tasks
                </div>
                <div
                  className={classNames(styles.tab, {
                    [styles.active]: activeTab === "editTasks",
                  })}
                  onClick={() => setActiveTab("editTasks")}
                >
                  Edit Tasks
                </div>
                <div
                  className={classNames(styles.tab, {
                    [styles.active]: activeTab === "unassignedTasks",
                  })}
                  onClick={() => setActiveTab("unassignedTasks")}
                >
                  Unassigned Tasks
                </div>
              </div>
            </div>
            {!isMobile && actionButtons}
          </div>

          {activeTab === "details" && <DetailsTab animalId={animalId} />}
          {activeTab === "tasks" && <TasksTab animalId={animalId} />}
          {activeTab === "editTasks" && (
            <TaskManagementTab animalId={animalId} />
          )}
          {activeTab === "unassignedTasks" && (
            <UnassignedTasksTab animalId={animalId} />
          )}
        </div>
      </div>
      <CreateUpdateAnimalModal
        initialData={animal}
        onSubmit={(data) => onEditSubmit(data)}
        isOpen={isEditAnimalModalOpen}
        setIsOpen={setIsEditAnimalModalOpen}
      />
      <EditCareStatusModal
        isOpen={isEditCareStatusModalOpen}
        currentStatus={careStatus}
        onSubmit={(data) => handleCareStatusSubmit(data)}
        setIsOpen={setIsEditCareStatusModalOpen}
      />
      <ConfirmModal
        isOpen={isPromptProcessOutcomeModalOpen}
        setIsOpen={setPromptProcessOutcomeModalOpen}
        title="Process Outcome?"
        message="Would you like to process an outcome for this animal?"
        confirmButtonText="Process Outcome"
        cancelButtonText="Close"
        onCancel={() => setPromptProcessOutcomeModalOpen(false)}
        onConfirm={() => {
          setPromptProcessOutcomeModalOpen(false);
          setIsAddOutcomeModalOpen(true);
        }}
      />
      <AddOutcomeModal
        animal={animal}
        onSubmit={async (data) => {
          try {
            await onEditSubmit(data);
            setIsAddOutcomeModalOpen(false);
          } catch (error) {
            console.error("Failed to update animal:", error);
          }
        }}
        isOpen={isAddOutcomeModalOpen}
        setIsOpen={setIsAddOutcomeModalOpen}
      />
    </div>
  );
};

export default AnimalDetailsPage;
