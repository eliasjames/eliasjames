import TaskContainer from "@/src/containers/TaskContainer";
import UserContainer from "@/src/containers/UsersContainer";
import TaskCard from "../TaskCard/TaskCard";
import { useEffect, useMemo, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import styles from "./TaskManagementPage.module.css";
import { Task } from "@prisma/client";
import { Button } from "@radix-ui/themes";
import CreateUpdateTaskModal from "../CreateUpdateTaskModal/CreateUpdateTaskModal";
import AddIcon from "@mui/icons-material/Add";
import { Tabs } from "../Tabs/Tabs";
import { CreateOrUpdateTaskDTO } from "@/src/models/tasks/CreateOrUpdateTaskDTO";
import { PermissionGate } from "../PermissionGate/PermissionGate";

const TaskManagementPage: React.FC = () => {
  const {
    tasks,
    createTask,
    deleteTask,
    updateTask,
    loading,
    initializeFromRemote: initializeTasksFromRemote,
  } = TaskContainer.useContainer();
  const { users, initializeFromRemote: initializeUsersFromRemote } =
    UserContainer.useContainer();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    initializeTasksFromRemote();
    initializeUsersFromRemote();
  }, []);

  const handleCreateTask = async (data: CreateOrUpdateTaskDTO) => {
    return await createTask(data);
  };

  const handleUpdateTask = async (data: CreateOrUpdateTaskDTO) => {
    return await updateTask(data);
  };

  const numberOfTasks = useMemo(() => tasks?.length, [tasks?.length]);
  const groupedTasks: Record<string, Task[]> = {};

  // Iterate over tasks and assign them to the appropriate groups based on their types
  tasks?.forEach((task) => {
    if (task?.type?.length < 1) {
      if (!groupedTasks["Other"]) {
        groupedTasks["Other"] = [];
      }
      groupedTasks["Other"].push(task);
    }
    task?.type?.forEach((taskType) => {
      if (!groupedTasks[taskType]) {
        groupedTasks[taskType] = [];
      }
      groupedTasks[taskType].push(task);
    });
  });

  const handleDelete = (id: string) => async () => {
    await deleteTask(id);
  };

  return (
    <PermissionGate
      anyPermission={["create:task", "update:task", "delete:task"]}
      fallback={<div>Unauthorized</div>}
    >
      <div className={styles.layout}>
        <NavigationBar
          selectedAppId="task-management"
          secondaryTitle="Task Management"
        />
        <div className={styles.content}>
          <div className={styles.header}>
            <Tabs
              handleSetTab={() => undefined}
              selectedTab="all"
              tabData={[
                {
                  tabName: "All tasks",
                  tabId: "all",
                  isLoading: loading,
                  tabCount: numberOfTasks,
                },
              ]}
            />
            <PermissionGate
              permission="create:task"
              fallback={<div>Unauthorized</div>}
            >
              <div className={styles["header-right"]}>
                <Button onClick={() => setIsCreateTaskModalOpen(true)}>
                  <AddIcon />
                  Create Task
                </Button>
              </div>
            </PermissionGate>
          </div>

          <div className={styles.tasks}>
            {loading && !tasks ? (
              <div>Loading...</div>
            ) : !tasks ? (
              <div>No tasks</div>
            ) : null}

            {Object.entries(groupedTasks).map(([type, tasksOfType]) => (
              <div key={type} className={styles.section}>
                <div className={styles["section-header"]}>{type}</div>
                <div className={styles["section-content"]}>
                  {tasksOfType.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={handleDelete(task.id)}
                      onClick={() => {
                        setEditingTask(task);
                        setIsCreateTaskModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <CreateUpdateTaskModal
          onSubmit={(data) => {
            handleCreateTask(data);
            setIsCreateTaskModalOpen(false);
          }}
          isOpen={isCreateTaskModalOpen}
          setIsOpen={setIsCreateTaskModalOpen}
          initialData={editingTask}
          onClose={() => setEditingTask(null)}
          onEditSubmit={(data) => {
            handleUpdateTask(data);
            setIsCreateTaskModalOpen(false);
          }}
        />
      </div>
    </PermissionGate>
  );
};

export default TaskManagementPage;
