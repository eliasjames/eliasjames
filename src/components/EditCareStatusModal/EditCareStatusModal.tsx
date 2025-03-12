import { useForm } from "react-hook-form";
import Modal from "../Shared/Modal/Modal";
import styles from "./EditCareStatusModal.module.css";
import { Form } from "../Shared/Form/Form";
import { Button, Select, MenuItem } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { CareStatus } from "@prisma/client";

export type EditCareStatusModalProps = {
  onSubmit: (data: CareStatus) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentStatus?: CareStatus;
};

const EditCareStatusModal: React.FC<EditCareStatusModalProps> = ({
  onSubmit,
  isOpen,
  setIsOpen,
  currentStatus,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ careStatus: CareStatus }>({
    defaultValues: {
      careStatus: currentStatus,
    },
  });

  return (
    <Modal isOpen={isOpen}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit((data) => onSubmit(data.careStatus))}>
          <Form.Container>
            <div className={styles.header}>
              Update Care Status
              <Button
                className={styles["close-button"]}
                onClick={() => setIsOpen(false)}
              >
                <CancelIcon />
              </Button>
            </div>
            <p className={styles["header-description"]}>
              If care status is set to INACTIVE, tasks assigned to the animal
              will not count toward the shelter's task dashboard and daily tasks
              will not be generated.
            </p>

            <div className={styles.divider} />

            <Form.Field label="Care Status" isRequired>
              <Select
                {...register("careStatus")}
                variant="outlined"
                defaultValue={currentStatus}
              >
                {Object.values(CareStatus).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.careStatus && (
                <Form.Message>This field is required</Form.Message>
              )}
            </Form.Field>
            <Form.Submit>Edit Care Status</Form.Submit>
          </Form.Container>
        </form>
      </div>
    </Modal>
  );
};

export default EditCareStatusModal;
