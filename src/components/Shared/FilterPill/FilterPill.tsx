import React from "react";
import styles from "./FilterPill.module.css";
import { Skeleton } from "@mui/material";
import classNames from "classnames";

export function FilterPill({
  title,
  count,
  isActive,
  onClick,
  isLoading,
}: {
  title: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  isLoading: boolean;
}) {
  return (
    <div
      className={classNames(styles.filter, {
        [styles.active]: isActive,
      })}
      onClick={onClick}
    >
      {title}
      {isLoading ? (
        <Skeleton
          className={styles.metric}
          height={21}
          width={21}
          variant={"rounded"}
        />
      ) : (
        <div className={styles["filter-tag"]}>{count}</div>
      )}
    </div>
  );
}
