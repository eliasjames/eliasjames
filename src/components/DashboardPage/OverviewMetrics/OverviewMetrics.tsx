import { TaskStatus } from "@prisma/client";
import React from "react";
import OverviewMetric from "./OverviewMetric";
import styles from "./OverviewMetrics.module.css";
import { AnimalDTO } from "@/src/models/animals/AnimalDTO";

interface OverviewMetricsProps {
  animals: AnimalDTO[] | undefined;
  isLoading: boolean;
}

const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  isLoading,
  animals,
}) => {
  if (animals == null && !isLoading) {
    return null;
  }

  const animalsWithFullyCompletedTasks =
    animals?.filter((animal) =>
      animal?.animalTasks?.every((task) => task.status === TaskStatus.COMPLETED)
    ).length || 0;

  const completedTasks = animals?.reduce(
    (acc, animal) =>
      acc +
      animal?.animalTasks?.filter(
        (task) => task.status === TaskStatus.COMPLETED
      ).length,
    0
  );

  const totalTasks = animals?.reduce(
    (acc, animal) => acc + animal?.animalTasks?.length,
    0
  );

  return (
    <div className={styles.metrics}>
      <OverviewMetric
        numerator={animalsWithFullyCompletedTasks ?? 0}
        denominator={animals?.length ?? 0}
        title="Pets Complete"
        isLoading={isLoading}
        showIcon={completedTasks === totalTasks}
      />
      <div className={styles.divider} />
      <OverviewMetric
        numerator={completedTasks ?? 0}
        denominator={totalTasks ?? 0}
        title="Tasks Complete"
        isLoading={isLoading}
        showIcon={false}
      />
    </div>
  );
};

export default OverviewMetrics;
