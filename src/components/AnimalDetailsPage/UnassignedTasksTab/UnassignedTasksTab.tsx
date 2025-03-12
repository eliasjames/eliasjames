import React from "react";
import { CreateOrUpdateTaskDTO } from "@/src/models/tasks/CreateOrUpdateTaskDTO";

interface Props {
  animalId: string;
}

const UnassignedTasksTab: React.FC<Props> = ({ animalId }) => {
  return (
    <div>
      <h2>Unassigned Tasks</h2>
    </div>
  );
};

export default UnassignedTasksTab;
