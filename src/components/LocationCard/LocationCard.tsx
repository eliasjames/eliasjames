import styles from "./LocationCard.module.css";
import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { LocationDTO } from "@/src/models/locations/LocationDTO";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

interface LocationCardProps {
  location: LocationDTO;
  onEdit?: () => void;
  onDelete?: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onEdit,
  onDelete,
}) => {
  const { name, capacity } = location;

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <div className={styles.basic}>
          <div className={styles.title}>{name}</div>
          <div className={styles.description}>Capacity: {capacity}</div>
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

export default LocationCard;
