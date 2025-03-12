import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "./CreateUpdateTaskModal.module.css";
import { TaskAssignment, TaskFrequency, TaskType } from "@prisma/client";
import UserContainer from "@/src/containers/UsersContainer";
import {
  Button,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Modal from "../Shared/Modal/Modal";
import { Form } from "../Shared/Form/Form";
import Checkbox from "@mui/material/Checkbox";
import { CreateOrUpdateTaskDTO } from "@/src/models/tasks/CreateOrUpdateTaskDTO";
import formatDateToISO from "@/src/utils/formatDateToISO";
import LocationContainer from "@/src/containers/LocationContainer";

export type CreateUpdateTaskModalProps = {
  onSubmit: (data: CreateOrUpdateTaskDTO) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  assignmentAnimalIds?: string[];
  initialData?: CreateOrUpdateTaskDTO | null;
  onClose?: () => void;
  onEditSubmit?: (data: CreateOrUpdateTaskDTO) => void;
};

const CreateUpdateTaskModal: React.FC<CreateUpdateTaskModalProps> = ({
  onSubmit,
  isOpen,
  setIsOpen,
  assignmentAnimalIds,
  initialData,
  onClose,
  onEditSubmit,
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreateOrUpdateTaskDTO>({
    defaultValues: {
      assignmentAnimalIds: assignmentAnimalIds,
      ...initialData,
    },
  });

  const frequencyValue = watch("frequency");

  const { locations, initializeFromRemote: initializeLocationsFromRemote } =
    LocationContainer.useContainer();

  const { users, initializeFromRemote: initializeUsersFromRemote } =
    UserContainer.useContainer();

  useEffect(() => {
    initializeLocationsFromRemote();
    initializeUsersFromRemote();
  }, []);

  useEffect(() => {
    if (assignmentAnimalIds && assignmentAnimalIds.length > 0) {
      reset({ assignmentAnimalIds, ...initialData });
    }
  }, [assignmentAnimalIds, reset, initialData]);

  const onModalClose = () => {
    reset();
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <div className={styles.container}>
        <form
          onSubmit={handleSubmit((data) => {
            if (initialData) {
              if (onEditSubmit) {
                onEditSubmit({
                  ...data,
                  id: initialData.id,
                });
              } else {
                console.error("onEditSubmit is not provided.");
              }
            } else {
              onSubmit(data);
            }
            onModalClose();
          })}
        >
          <input type="hidden" {...register("assignmentAnimalIds")} />
          <Form.Container>
            <div className={styles.header}>
              {initialData ? <p>Edit Task</p> : <p>Create a task</p>}
              <Button
                className={styles["close-button"]}
                onClick={() => {
                  onModalClose();
                  setIsOpen(false);
                }}
              >
                <CancelIcon />
              </Button>
            </div>
            <Form.Field label="Title" isRequired>
              <TextField
                {...register("title", { required: true })}
                variant="outlined"
                defaultValue={initialData?.title}
              />
              {errors.title && (
                <Form.Message>This field is required</Form.Message>
              )}
            </Form.Field>
            <Form.Field label="Description">
              <TextField
                {...register("description")}
                variant="outlined"
                defaultValue={initialData?.description}
              />
            </Form.Field>
            <Form.Field label="Notes">
              <TextField
                {...register("notes")}
                variant="outlined"
                defaultValue={initialData?.notes}
              />
            </Form.Field>
            <Form.Field label="Frequency" isRequired>
              <Select
                {...register("frequency")}
                variant="outlined"
                defaultValue={initialData?.frequency ?? TaskFrequency.DAILY}
              >
                {Object.values(TaskFrequency).map((frequency) => (
                  <MenuItem key={frequency} value={frequency}>
                    {frequency}
                  </MenuItem>
                ))}
              </Select>
            </Form.Field>
            {frequencyValue !== TaskFrequency.DAILY && (
              <Form.Field label="Due date">
                <TextField
                  {...register("dueDate")}
                  type="date"
                  variant="outlined"
                  defaultValue={
                    initialData?.dueDate
                      ? formatDateToISO(initialData.dueDate)
                      : ""
                  }
                />
              </Form.Field>
            )}

            <Form.Field
              label="Due time"
              isRequired={frequencyValue === TaskFrequency.DAILY}
            >
              <TextField
                {...register("dueTime")}
                type="time"
                variant="outlined"
              />
              {errors.dueTime && (
                <Form.Message>This field is required</Form.Message>
              )}
            </Form.Field>

            <Form.Field label="Animals to assign to: ">
              <Controller
                name="assignmentCategories"
                control={control}
                defaultValue={initialData?.assignmentCategories ?? []}
                render={({ field }) => (
                  <Select
                    {...field}
                    multiple
                    variant="outlined"
                    renderValue={(selected) =>
                      typeof selected === "string"
                        ? selected
                        : (selected as string[]).join(", ")
                    }
                    value={field.value || []}
                    onChange={(event) =>
                      field.onChange(event.target.value as TaskAssignment[])
                    }
                  >
                    {(Object.values(TaskAssignment) as TaskAssignment[]).map(
                      (assignment) => (
                        <MenuItem key={assignment} value={assignment}>
                          <Checkbox
                            checked={
                              Array.isArray(field.value) &&
                              field.value.includes(assignment)
                            }
                            defaultChecked={initialData?.assignmentCategories?.includes(
                              assignment
                            )}
                          />
                          <ListItemText primary={assignment} />
                        </MenuItem>
                      )
                    )}
                  </Select>
                )}
              />
            </Form.Field>

            <Form.Field label="Staff/Volunteer to assign to: ">
              <Select
                {...register("assignedStaffIds")}
                variant="outlined"
                multiple
                defaultValue={initialData?.assignedStaffIds || []}
                renderValue={(selected) => {
                  if (Array.isArray(selected)) {
                    return selected
                      .map(
                        (id) =>
                          users?.find((user) => user.id === id)?.preferredName
                      )
                      .filter(Boolean)
                      .join(", ");
                  }
                  return selected;
                }}
              >
                {users?.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.preferredName}
                  </MenuItem>
                ))}
              </Select>
            </Form.Field>

            <Form.Field label="Location to assign to: ">
              <Select
                {...register("locationsIds")}
                variant="outlined"
                multiple
                defaultValue={initialData?.locationsIds || []}
                renderValue={(selected) => {
                  if (Array.isArray(selected)) {
                    return selected
                      .map(
                        (id) =>
                          locations?.find(
                            (location) => location.id === id?.toString()
                          )?.name
                      )
                      .filter(Boolean)
                      .join(", ");
                  }
                  return selected;
                }}
              >
                {locations?.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </Form.Field>

            <Form.Field label="Task type">
              <Controller
                name="type"
                control={control}
                defaultValue={initialData?.type ?? []}
                render={({ field }) => (
                  <Select
                    {...field}
                    multiple
                    variant="outlined"
                    renderValue={(selected) =>
                      typeof selected === "string"
                        ? selected
                        : (selected as string[]).join(", ")
                    }
                    value={field.value || []}
                  >
                    {Object.values(TaskType).map((type) => (
                      <MenuItem key={type} value={type}>
                        <Checkbox
                          checked={
                            Array.isArray(field.value) &&
                            field.value.includes(type)
                          }
                        />
                        <ListItemText primary={type} />
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </Form.Field>
            <Form.Submit>{initialData ? "Update" : "Create"}</Form.Submit>
          </Form.Container>
        </form>
      </div>
    </Modal>
  );
};

export default CreateUpdateTaskModal;
