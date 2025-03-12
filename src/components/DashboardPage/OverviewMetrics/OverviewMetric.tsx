import { Skeleton } from "@mui/material";
import styles from "./OverviewMetrics.module.css";
import React from "react";
import classNames from "classnames";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface OverviewMetricProps {
  numerator: number;
  denominator: number;
  title: string;
  isLoading: boolean;
  showIcon?: boolean;
}

const OverviewMetric: React.FC<OverviewMetricProps> = ({
  numerator,
  denominator,
  title,
  isLoading,
  showIcon = true,
}) => {
  if (isLoading) {
    return (
      <div className={styles.metric}>
        {showIcon && (
          <Skeleton
            variant={"circular"}
            height={20}
            width={20}
            className={styles.icon}
          />
        )}
        <div className={styles["metric-content"]}>
          <Skeleton className={styles["metric-value"]} height={18} width={45} />
          <Skeleton className={styles["metric-text"]} height={18} width={100} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames(styles.metric, {
        [styles.complete]: numerator === denominator,
        [styles["not-started"]]: numerator === 0 && denominator > 0,
        [styles["incomplete"]]:
          numerator > 0 && denominator > 0 && numerator < denominator,
        [styles["no-data"]]: numerator === 0 && denominator === 0,
      })}
    >
      {showIcon && <CheckCircleIcon className={styles.icon} />}
      <div className={styles["metric-content"]}>
        <div
          className={styles["metric-value"]}
        >{`${numerator} / ${denominator}`}</div>
        <div className={styles["metric-text"]}>{title}</div>
      </div>
    </div>
  );
};

export default OverviewMetric;
