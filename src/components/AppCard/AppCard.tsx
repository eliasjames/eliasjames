import React, { ReactNode } from "react";
import styles from "./AppCard.module.css";
import Link from "next/link";

export default function AppCard({
  relativePath,
  title,
  description,
  iconSvg,
  color,
}: {
  relativePath: string;
  title: string;
  description: string;
  iconSvg: ReactNode;
  color: string;
}) {
  return (
    <Link href={relativePath} className={styles["app-card"]}>
      <div>
        <div className={styles["app-card-header"]}>
          <div
            className={styles["app-icon"]}
            style={{ color, backgroundColor: color + "20" }}
          >
            {iconSvg}
          </div>
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles["app-card-description"]}>{description}</div>
      </div>
    </Link>
  );
}
