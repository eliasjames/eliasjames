import styles from "./AnimalDetailsCard.module.css";
import React from "react";

interface AnimalDetailsCardProps {
  title: string;
  details: { label: string; detail: string }[];
}

const AnimalDetailsCard: React.FC<AnimalDetailsCardProps> = ({
  title,
  details,
}) => {
  return (
    <div className={styles["overview-card"]}>
      <div className={styles["overview-title"]}>{title}</div>
      <div className={styles["overview-content"]}>
        {details.map(({ label, detail }) => (
          <div className={styles["overview-row"]} key={label}>
            <div className={styles["overview-label"]}>{label}</div>
            <div className={styles["overview-value"]}>{detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimalDetailsCard;
