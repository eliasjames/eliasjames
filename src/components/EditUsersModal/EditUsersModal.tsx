import UserDTO from "@/src/models/users/UserDTO";
import { useForm } from "react-hook-form";
import Modal from "../Shared/Modal/Modal";
import styles from "./EditUsersModal.module.css";
import { Form } from "../Shared/Form/Form";
import { Button, FormControlLabel, FormGroup, Switch } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import CreateUpdateShelterUserInviteDTO from "@/src/models/shelters/CreateUpdateShelterUserInvite";
import permissionsList from "@/src/constants/permissions.json";

export type EditUsersModalProps = {
  onSubmit: (data: CreateUpdateShelterUserInviteDTO) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialData?: UserDTO;
};

const EditUsersModal: React.FC<EditUsersModalProps> = ({
  onSubmit,
  isOpen,
  setIsOpen,
  initialData,
}) => {
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<CreateUpdateShelterUserInviteDTO>({
      defaultValues: {
        isAdmin: false,
        isStaff: false,
        isVolunteer: false,
        permissions: [],
      },
    });

  const [permissions, setPermissions] = useState(
    initialData?.permissions || []
  );

  const handleFormSubmit = (data: CreateUpdateShelterUserInviteDTO) => {
    data.permissions = permissions;
    onSubmit(data);
    handleClose();
  };
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        isAdmin: initialData.isAdmin ?? false,
        isStaff: initialData.isStaff ?? false,
        isVolunteer: initialData.isVolunteer ?? false,
        permissions: initialData.permissions ?? [],
      });
      setPermissions(initialData.permissions || []);
    }
  }, [initialData, isOpen, reset]);

  // Ensure the form resets completely when modal is closed
  const handleClose = () => {
    reset({
      isAdmin: false,
      isStaff: false,
      isVolunteer: false,
      permissions: [],
    });
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Form.Container>
            <div className={styles.header}>
              Edit Users
              <Button className={styles["close-button"]} onClick={handleClose}>
                <CancelIcon />
              </Button>
            </div>
            <p className={styles["header-description"]}>
              Edit {initialData?.firstName} {initialData?.lastName}
            </p>
            <div className={styles.divider} />
            <Form.Field label="Role">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      {...register("isAdmin")}
                      checked={watch("isAdmin")}
                      onChange={(e) => setValue("isAdmin", e.target.checked)}
                    />
                  }
                  label={<b>Admin</b>}
                />
                <FormControlLabel
                  control={
                    <Switch
                      {...register("isStaff")}
                      checked={watch("isStaff")}
                      onChange={(e) => setValue("isStaff", e.target.checked)}
                    />
                  }
                  label={<b>Staff</b>}
                />
                <FormControlLabel
                  control={
                    <Switch
                      {...register("isVolunteer")}
                      checked={watch("isVolunteer")}
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
                        checked={permissions?.includes(key)}
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
            <Form.Submit>Save Changes</Form.Submit>
          </Form.Container>
        </form>
      </div>
    </Modal>
  );
};

export default EditUsersModal;
