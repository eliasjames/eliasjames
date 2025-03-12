import React, { useState } from "react";
import styles from "./HomePage.module.css";
import HomeIcon from "@mui/icons-material/Home";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import ShelterContainer from "@/src/containers/ShelterContainer";
import { CreateOrUpdateShelterDTO } from "@/src/models/shelters/CreateOrUpdateShelterDTO";
import AppCard from "../AppCard/AppCard";
import CreateShelterModal from "../CreateShelterModal/CreateShelterModal";
import NavigationBar from "../NavigationBar/NavigationBar";
import OverlayCard from "../Shared/OverlayCard/OverlayCard";

export default function HomePage() {
  const session = useSession();
  const router = useRouter();

  const user = session.data?.user;
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const { createShelter, shelters } = ShelterContainer.useContainer();

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const handleCreateShelter = (data: CreateOrUpdateShelterDTO) => {
    setCreateModalOpen(false);
    createShelter(data);
  };

  const handleSignUpClick = () => {
    router.push("/sign-up");
  };

  // TODO: Add skeleton

  return (
    <div className={styles.page}>
      <NavigationBar />
      <div className={styles.main}>
        <div className={styles.titles}>
          {user ? (
            <>
              <p>Welcome, {user.name}</p>
              {shelters && shelters.length > 0 ? (
                shelters.map((shelter) => (
                  <div key={shelter.id} className={styles.apps}>
                    <AppCard
                      relativePath={`/${shelter.id}/`}
                      title={shelter.name}
                      description="View and manage this shelter"
                      iconSvg={<HomeIcon />}
                      color="#f58220"
                    />
                  </div>
                ))
              ) : (
                <div>
                  <h2>Create a Shelter</h2>
                  <Button onClick={handleCreateClick}>Create</Button>
                </div>
              )}
            </>
          ) : (
            <OverlayCard
              title={"Welcome to Project Tailwind"}
              imageUrl="/images/emerson_logo_pink.png"
              content={
                <div className={styles["auth-buttons"]}>
                  <Button
                    variant="outlined"
                    onClick={() => signIn()}
                    className={styles["auth-button-secondary"]}
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleSignUpClick}
                    className={styles["auth-button-secondary"]}
                  >
                    Sign up
                  </Button>
                </div>
              }
            />
          )}
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
