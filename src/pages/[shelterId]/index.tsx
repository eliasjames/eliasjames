import React, { useState } from "react";
import styles from "./index.module.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import ChecklistIcon from "@mui/icons-material/Checklist";
import PetsIcon from "@mui/icons-material/Pets";
import AppCard from "../../components/AppCard/AppCard";
import { useSession } from "next-auth/react";
import CreateShelterModal from "../../components/CreateShelterModal/CreateShelterModal";
import ShelterContainer from "../../containers/ShelterContainer";
import { CreateOrUpdateShelterDTO } from "../../models/shelters/CreateOrUpdateShelterDTO";
import TaskIcon from "@mui/icons-material/Task";
import { PermissionGate } from "@/src/components/PermissionGate/PermissionGate";

export default function Home() {
  const session = useSession();

  const user = session.data?.user;
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const { createShelter, currentShelter: shelter } =
    ShelterContainer.useContainer();

  const handleCreateShelter = (data: CreateOrUpdateShelterDTO) => {
    setCreateModalOpen(false);
    createShelter(data);
  };

  // TODO: Add skeleton

  return (
    <div className={styles.page}>
      <NavigationBar />
      <div className={styles.main}>
        <div className={styles.titles}>
          <h1>Welcome, {user?.name}</h1>
        </div>
        <div className={styles.apps}>
          <AppCard
            relativePath={`/${shelter?.id}/dashboard`}
            title="Daily Rounds"
            description="View all pets basic information as well as daily rounds tasks."
            iconSvg={<PetsIcon />}
            color="#00bcd4"
          />
          <AppCard
            relativePath={`/${shelter?.id}/task-triage`}
            title="Task Triage"
            description="Quickly triage daily rounds tasks by task type or location."
            iconSvg={<ChecklistIcon />}
            color="#ffb300"
          />
          <PermissionGate
            anyPermission={["update:task", "delete:task", "create:task"]}
          >
            <AppCard
              relativePath={`/${shelter?.id}/task-management`}
              title="Task Management"
              description="Manage daily rounds task at a shelter, species, or individual pet level."
              iconSvg={<TaskIcon />}
              color="#7cb342"
            />
          </PermissionGate>
          <PermissionGate
            anyPermission={["update:user", "delete:user", "create:user"]}
          >
            <AppCard
              relativePath={`/${shelter?.id}/user-management`}
              title="User Management"
              description="Add, edit, and remove users from this shelter"
              iconSvg={<PetsIcon />}
              color={"#ff4081"}
            />
          </PermissionGate>
          <AppCard
            relativePath={`/${shelter?.id}/location-management`}
            title="Location Management"
            description="Add, edit, and remove locations animals are housed in."
            iconSvg={<PetsIcon />}
            color={"#ff4081"}
          />
        </div>
      </div>
      <CreateShelterModal
        userId={user?.id ?? ""}
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={(data) => {
          handleCreateShelter(data);
        }}
      />
    </div>
  );
}
