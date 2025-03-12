import styles from "./NavigationBar.module.css";
import React from "react";
import ChecklistIcon from "@mui/icons-material/Checklist";
import TaskIcon from "@mui/icons-material/Task";
import PetsIcon from "@mui/icons-material/Pets";
import Link from "next/link";
import classNames from "classnames";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

export default function AppsMenu({
  selectedAppId,
}: {
  selectedAppId?: string;
}) {
  const router = useRouter();
  if (!router.query.shelterId) return null;
  return (
    <div className={styles["apps-list"]}>
      <Button
        href={`/${router.query.shelterId}/dashboard`}
        LinkComponent={Link}
        className={classNames(styles["app-button"], {
          [styles.selected]: selectedAppId === "dashboard",
        })}
      >
        <PetsIcon style={{ color: "#00bcd4" }} />
        Daily Rounds
      </Button>
      <Button
        href={`/${router.query.shelterId}/task-triage`}
        LinkComponent={Link}
        className={classNames(styles["app-button"], {
          [styles.selected]: selectedAppId === "task-triage",
        })}
      >
        <ChecklistIcon style={{ color: "#ffb300" }} />
        Task Triage
      </Button>
      <Button
        href={`/${router.query.shelterId}/task-management`}
        LinkComponent={Link}
        className={classNames(styles["app-button"], {
          [styles.selected]: selectedAppId === "task-management",
        })}
      >
        <TaskIcon style={{ color: "#7cb342" }} />
        Task Management
      </Button>
    </div>
  );
}
