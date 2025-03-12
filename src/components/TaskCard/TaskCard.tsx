import React from "react";
import styles from "./TaskCard.module.css";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CreateOrUpdateTaskDTO } from "@/src/models/tasks/CreateOrUpdateTaskDTO";

interface TaskCardProps {
  task: CreateOrUpdateTaskDTO;
  onDelete: () => void;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onClick }) => {
  return (
    <div className={styles.card}>
      <div className={styles["task-data"]} onClick={onClick}>
        <div className={styles.basic}>
          <div className={styles.title}>{task.title}</div>
          <div className={styles.description}>{task.description}</div>
        </div>

        <div className={styles.tags}>
          {!!task.frequency && (
            <div className={styles.tag}>{task.frequency}</div>
          )}
          {!!task.assignmentCategories?.length &&
            task.assignmentCategories?.map((task) => (
              <div className={styles.tag}>{task}</div>
            ))}
        </div>
      </div>

      <Button
        className={styles.delete}
        aria-label="Close"
        onClick={onDelete}
        color="error"
      >
        <CloseIcon />
      </Button>
    </div>
  );
};

export default TaskCard;
