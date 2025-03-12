import React from "react";
import styles from "./DetailsTab.module.css";
import AnimalDetailsCard from "../AnimalDetailsCard/AnimalDetailsCard";
import AnimalTimelineCard from "../AnimalTimelineCard/AnimalTimelineCard";
import { TaskStatus } from "@prisma/client";
import { useRouter } from "next/router";
import AnimalContainer from "@/src/containers/AnimalContainer";

type DetailsTabProps = {
  animalId: string;
};

const DetailsTab: React.FC<DetailsTabProps> = ({ animalId }) => {
  const { animals } = AnimalContainer.useContainer();
  const animal = animals.find((animal) => animal.id === animalId);

  if (!animal) {
    return <div>Animal not found</div>;
  }

  const {
    breeds,
    dateOfBirth,
    adoptionStatus,
    animalTasks: tasks,
    intakeDate,
    intakeCategory,
    outcomeDate,
    sex,
    biography,
    placementInfo,
    outcomeCategory,
    events,
  } = animal;

  const lengthOfStay = outcomeDate
    ? Math.floor(
        new Date(outcomeDate).getTime() - new Date(intakeDate ?? "").getTime()
      ) /
      (1000 * 60 * 60 * 24)
    : Math.floor(
        (new Date().getTime() - new Date(intakeDate ?? "").getTime()) /
          (1000 * 60 * 60 * 24)
      );

  return (
    <>
      <div className={styles["snapshot-container"]}>
        <div className={styles.block}>
          <div className={styles["block-title"]}>Length of Stay</div>
          <div className={styles["block-content"]}>{lengthOfStay} days</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.block}>
          <div className={styles["block-title"]}>Intake category</div>
          <div className={styles["block-content"]}>{intakeCategory}</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.block}>
          <div className={styles["block-title"]}>Daily rounds</div>
          <div className={styles["block-content"]}>
            {
              tasks.filter((task) => task.status === TaskStatus.COMPLETED)
                .length
            }
            / {tasks.length} complete
          </div>
        </div>
      </div>
      <div className={styles["details-container"]}>
        <div className={styles["details-left"]}>
          <AnimalDetailsCard
            title={"Overview"}
            details={[
              {
                label: "Date of birth",
                detail: dateOfBirth
                  ? new Date(dateOfBirth).toLocaleDateString()
                  : "-",
              },
              { label: "Sex", detail: sex },
              { label: "Breeds", detail: breeds.join(", ") },
            ]}
          />
          <AnimalDetailsCard
            title={"Intake"}
            details={[
              {
                label: "Intake date",
                detail: intakeDate
                ? new Date(intakeDate).toLocaleDateString()
                : "-",
              },
              { label: "Intake category", detail: intakeCategory },
            ]}
          />
        </div>
        <div className={styles["details-center"]}>
          <AnimalDetailsCard
            title={"Outcome"}
            details={[
              {
                label: "Outcome date",
                detail: outcomeDate
                  ? new Date(outcomeDate).toLocaleDateString()
                  : "Not adopted",
              },
              { label: "Length of stay", detail: `${lengthOfStay} days` },
              {
                label: "Outcome category",
                detail: outcomeCategory ?? "-",
              },
            ]}
          />
          <AnimalDetailsCard
            title={"Adoption Information"}
            details={[
              { label: "Adoption Status", detail: adoptionStatus },
              { label: "Biography", detail: biography },
              {
                label: "Placement info",
                detail: placementInfo?.join(", "),
              },
            ]}
          />
        </div>

        {!!events?.length && (
          <AnimalTimelineCard
            title={"Adoption Timeline"}
            events={events ?? []}
          />
        )}
      </div>
    </>
  );
};

export default DetailsTab;
