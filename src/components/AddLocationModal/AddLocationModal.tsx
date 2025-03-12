import { LocationDTO } from "@/src/models/locations/LocationDTO";
import { useForm } from "react-hook-form";
import Modal from "../Shared/Modal/Modal";
import styles from "./AddLocationModal.module.css";
import { Form } from "../Shared/Form/Form";
import { Button, Select, MenuItem, TextField } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { LocationType } from "@prisma/client";

export type AddLocationModalProps = {
  onSubmit: (data: LocationDTO) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialData?: LocationDTO;
};

const AddLocationModal: React.FC<AddLocationModalProps> = ({
  onSubmit,
  isOpen,
  setIsOpen,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationDTO>();

  return (
    <Modal isOpen={isOpen}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Container>
            <div className={styles.header}>
              Add Location
              <Button
                className={styles["close-button"]}
                onClick={() => setIsOpen(false)}
              >
                <CancelIcon />
              </Button>
            </div>
            <p className={styles["header-description"]}>
              Create a new location where an animal is housed.
            </p>

            <div className={styles.divider} />

            <Form.Field label="Name" isRequired>
              <TextField
                {...register("name", { required: true })}
                placeholder="Name"
              />
            </Form.Field>

            <Form.Field label="Capacity" isRequired>
              <TextField
                {...register("capacity", { required: true })}
                placeholder="Capacity"
              />
            </Form.Field>
            <Form.Field label="Type" isRequired>
              <Select
                {...register("type")}
                variant="outlined"
                defaultValue={initialData?.type}
              >
                {Object.values(LocationType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && (
                <Form.Message>This field is required</Form.Message>
              )}
            </Form.Field>
            <Form.Submit>Add Location</Form.Submit>
          </Form.Container>
        </form>
      </div>
    </Modal>
  );
};

export default AddLocationModal;
