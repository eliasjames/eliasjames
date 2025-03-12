import React from "react";
import styles from "./OverlayCard.module.css";
import { useMediaQuery } from "@mui/material";
import classNames from "classnames";

export default function OverlayCard({
  title,
  imageUrl,
  content,
  footer,
}: {
  title?: string;
  imageUrl: string;
  content?: React.ReactElement;
  footer?: React.ReactElement;
}) {
  const isMobile = useMediaQuery("(max-width: 400px)");

  return (
    <div className={styles["login-card-outer"]}>
      <div className={styles["login-card"]}>
        <div className={styles["image-container"]}>
          <img
            className={classNames(styles["login-image"], {
              [styles.small]: isMobile,
            })}
            src={imageUrl}
          />
        </div>
        <div className={styles.body}>
          {title != null && (
            <div className={styles["welcome-text"]}>{title}</div>
          )}
          {content}
        </div>
      </div>
      {footer != null && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
