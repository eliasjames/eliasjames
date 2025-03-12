import { useForm } from "react-hook-form";
import Modal from "../Shared/Modal/Modal";
import styles from "./AddOutcomeModal.module.css";
import { Form } from "../Shared/Form/Form";
import { Button, Select, MenuItem, TextField } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { OutcomeCategory } from "@prisma/client";
import { AnimalDTO } from "@/src/models/animals/AnimalDTO";

export type AddOutcomeModalProps = {
  onSubmit: (data: AnimalDTO) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  animal?: AnimalDTO;
};

const AddOutcomeModal: React.FC<AddOutcomeModalProps> = ({
  onSubmit,
  isOpen,
  setIsOpen,
  animal,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnimalDTO>();

  return (
    <Modal isOpen={isOpen}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Container>
            <div className={styles.header}>
              Add Outcome for {animal?.name}
              <Button
                className={styles["close-button"]}
                onClick={() => setIsOpen(false)}
              >
                <CancelIcon />
              </Button>
            </div>

            <div className={styles.divider} />

            <Form.Field label="Outcome date" isRequired>
              <TextField
                {...register("outcomeDate", { required: true, min: 0 })}
                type="date"
              />
              {errors.outcomeDate && (
                <Form.Message>
                  This field is required and must be a positive number
                </Form.Message>
              )}
            </Form.Field>

            <Form.Field label="Outcome Category" isRequired>
              <Select
                {...register("outcomeCategory", { required: true })}
                variant="outlined"
              >
                {Object.values(OutcomeCategory).map((outcome) => (
                  <MenuItem key={outcome} value={outcome}>
                    {outcome}
                  </MenuItem>
                ))}
              </Select>
              {errors.outcomeCategory && (
                <Form.Message>This field is required</Form.Message>
              )}
            </Form.Field>
            <Form.Field label="Notes">
              <TextField
                {...register("outcomeNotes")}
                placeholder="Outcome Notes"
              />
            </Form.Field>
            <Form.Submit>Add Outcome</Form.Submit>
          </Form.Container>
        </form>
      </div>
    </Modal>
  );
};

export default AddOutcomeModal;
