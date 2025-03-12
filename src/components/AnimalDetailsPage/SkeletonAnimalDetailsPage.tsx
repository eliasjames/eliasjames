import styles from "./AnimalDetailsPage.module.css";
import React from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import { Button, Skeleton } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import classNames from "classnames";

const SkeletonAnimalDetailsPage: React.FC = () => {
  return (
    <div className={styles.layout}>
      <NavigationBar />
      <div className={styles["page-layout"]}>
        <div className={styles["page-content"]}>
          <div className={styles["header-container"]}>
            <Skeleton
              className={classNames(styles.image, styles["skeleton-image"])}
              variant={"rounded"}
              height={200}
              width={200}
            />
            <div className={styles["heading-content"]}>
              <div className={styles["header-animal-content-container"]}>
                <Skeleton
                  className={styles["animal-name"]}
                  height={30}
                  width={110}
                />
                <Skeleton
                  className={styles["animal-id"]}
                  height={24}
                  width={220}
                />
                <div className={styles["info-row"]}>
                  <Skeleton
                    className={styles["info-row"]}
                    height={24}
                    width={80}
                  />

                  <Skeleton
                    className={styles["info-row"]}
                    height={24}
                    width={30}
                  />
                </div>
                <Skeleton
                  className={styles["info-row"]}
                  height={24}
                  width={30}
                />
                <Skeleton
                  className={styles["info-row"]}
                  height={29}
                  width={84}
                  variant={"rounded"}
                />
              </div>
              <div className={styles["tabs-container"]}>
                <div className={classNames(styles.tab, styles.disabled)}>
                  Details
                </div>
                <div className={classNames(styles.tab, styles.disabled)}>
                  Tasks
                </div>
                <div className={classNames(styles.tab, styles.disabled)}>
                  Edit Tasks
                </div>
              </div>
            </div>
            <div className={styles["header-actions-container"]}>
              <Button className={styles["action-button"]} disabled>
                <ModeEditIcon />
                Edit
              </Button>

              <Button className={styles["action-button"]} disabled>
                <DeleteIcon />
                Delete
              </Button>
            </div>
          </div>
          <Skeleton variant={"rounded"} width={"100%"} height={500} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonAnimalDetailsPage;
