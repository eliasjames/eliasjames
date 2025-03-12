import React from "react";
import styles from "./UserCard.module.css";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

interface UserCardProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  firstName,
  lastName,
  email,
  onDelete,
  onEdit,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <div className={styles.basic}>
          <div className={styles.title}>
            {firstName} {lastName}
          </div>
          <div className={styles.description}>{email}</div>
        </div>
        <div className={styles.actions}>
          <Button
            className={styles.edit}
            aria-label="Edit"
            onClick={onEdit}
            color="primary"
          >
            <ModeEditIcon />
          </Button>
          <Button
            className={styles.delete}
            aria-label="Close"
            onClick={onDelete}
            color="error"
          >
            <DeleteIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
