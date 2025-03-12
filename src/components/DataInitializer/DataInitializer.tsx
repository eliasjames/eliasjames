import React, { useEffect } from "react";
import styles from "./DataInitializer.module.css";

import ShelterContainer from "../../containers/ShelterContainer";
import { useRouter } from "next/router";
import NavigationBar from "../NavigationBar/NavigationBar";
import OverlayCard from "../Shared/OverlayCard/OverlayCard";
import { Button } from "@mui/material";
import Link from "next/link";
import UndoIcon from "@mui/icons-material/Undo";

export default function DataInitializer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { initializeFromRemote, initializing, currentShelter } =
    ShelterContainer.useContainer();
  useEffect(() => {
    initializeFromRemote();
  }, []);

  const shelterId = useRouter().query.shelterId as string;

  if (initializing) {
    return (
      <SkeletonHomePage
        displayText="Welcome to Project Tailwind"
        content={<div>Loading...</div>}
      />
    );
  }
  if (currentShelter == null && shelterId) {
    return (
      <SkeletonHomePage
        displayText="No shelter found..."
        content={
          <Button
            href={`/`}
            LinkComponent={Link}
            className={styles["home-button"]}
            startIcon={<UndoIcon />}
            variant="outlined"
          >
            Return home
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
}

function SkeletonHomePage({
  displayText,
  content,
}: {
  displayText: string;
  content?: React.ReactElement;
}) {
  return (
    <div className={styles.page}>
      <NavigationBar />
      <div className={styles.main}>
        <img
          className={styles["background-image"]}
          src={"/images/emerson_head.png"}
        />
        <OverlayCard
          title={displayText}
          imageUrl="/images/emerson_logo_pink.png"
          content={content}
        />
      </div>
    </div>
  );
}
