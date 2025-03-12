import UserDTO from "@/src/models/users/UserDTO";
import { useForm } from "react-hook-form";
import Modal from "../Shared/Modal/Modal";
import styles from "./AddUsersModal.module.css";
import { Form } from "../Shared/Form/Form";
import {
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import CreateUpdateShelterUserInviteDTO from "@/src/models/shelters/CreateUpdateShelterUserInvite";
import permissionsList from "@/src/constants/permissions.json";

export type AddUsersModalProps = {
  onSubmit: (data: CreateUpdateShelterUserInviteDTO) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialData?: UserDTO;
};

const AddUsersModal: React.FC<AddUsersModalProps> = ({
  onSubmit,
  isOpen,
  setIsOpen,
  initialData,
}) => {
  const { register, handleSubmit, setValue, watch } =
    useForm<CreateUpdateShelterUserInviteDTO>();

  const [permissions, setPermissions] = useState(initialData?.permissions);

  const isAdmin = watch("isAdmin");
  const isStaff = watch("isStaff");
  const isVolunteer = watch("isVolunteer");

  useEffect(() => {
    let assignedPermissions: string[] = [];

    if (isAdmin) {
      assignedPermissions = permissionsList.roles.admin;
    } else if (isStaff) {
      assignedPermissions = permissionsList.roles.staff;
    } else if (isVolunteer) {
      assignedPermissions = permissionsList.roles.volunteer;
    }

    setValue("permissions", assignedPermissions);
    setPermissions(assignedPermissions);
  }, [isAdmin, isStaff, isVolunteer, setValue]);

  const handleFormSubmit = (data: CreateUpdateShelterUserInviteDTO) => {
    data.permissions = permissions;
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Form.Container>
            <div className={styles.header}>
              Add Users
              <Button
                className={styles["close-button"]}
                onClick={() => setIsOpen(false)}
              >
                <CancelIcon />
              </Button>
            </div>
            <p className={styles["header-description"]}>
              Create a new invite for a user to join your shelter.{" "}
            </p>
            <p className={styles["header-description"]}>
              If they have an account matching the email address you provide,
              they will automatically be added to the shelter.
            </p>
            <p className={styles["header-description"]}>
              If they do not have an account, they will need to make one with
              the same email address you provided to be added to the shelter.
            </p>
            <div className={styles.divider} />

            <Form.Field label="Email address" isRequired>
              <TextField
                {...register("email", { required: true })}
                placeholder="Email address"
              />
            </Form.Field>
            <div className={styles.divider} />
            <Form.Field label="Role">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      {...register("isAdmin")}
                      checked={isAdmin}
                      onChange={(e) => setValue("isAdmin", e.target.checked)}
                    />
                  }
                  label={<b>Admin</b>}
                />
                <FormControlLabel
                  control={
                    <Switch
                      {...register("isStaff")}
                      checked={isStaff}
                      onChange={(e) => setValue("isStaff", e.target.checked)}
                    />
                  }
                  label={<b>Staff</b>}
                />
                <FormControlLabel
                  control={
                    <Switch
                      {...register("isVolunteer")}
                      checked={isVolunteer}
                      onChange={(e) =>
                        setValue("isVolunteer", e.target.checked)
                      }
                    />
                  }
                  label={<b>Volunteer</b>}
                />
              </FormGroup>
            </Form.Field>

            <Form.Field label="Permissions">
              <FormGroup className="permissions-container">
                {permissionsList.permissions.map(({ key, label }) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Switch
                        {...register("permissions")}
                        checked={watch("permissions")?.includes(key)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setPermissions((prev) => {
                            const updatedPermissions = checked
                              ? [...(prev || []), key] // Add permission if checked
                              : (prev || []).filter((perm) => perm !== key); // Remove permission if unchecked

                            // Update both the permissions state and the form field
                            setValue("permissions", updatedPermissions);
                            return updatedPermissions;
                          });
                        }}
                      />
                    }
                    label={label}
                  />
                ))}
              </FormGroup>
            </Form.Field>
            <Form.Submit>Add User</Form.Submit>
          </Form.Container>
        </form>
      </div>
    </Modal>
  );
};

export default AddUsersModal;
