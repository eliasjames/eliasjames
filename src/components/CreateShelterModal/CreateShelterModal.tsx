import { CreateOrUpdateShelterDTO } from "@/src/models/shelters/CreateOrUpdateShelterDTO";
import Modal from "../Shared/Modal/Modal";
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "../Shared/Form/Form";
import { Button } from "@mui/material";
import styles from "./CreateShelterModal.module.css";

interface CreateShelterModalProps {
  userId: string;
  onClose?: () => void;
  onSubmit: (data: CreateOrUpdateShelterDTO) => void;
  isOpen: boolean;
}

const CreateShelterModal: React.FC<CreateShelterModalProps> = ({
  userId,
  onClose,
  isOpen,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrUpdateShelterDTO>();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Container>
            <Form.Field label="Name">
              <input {...register("name")} />
            </Form.Field>
            <Form.Field label="Address Line 1">
              <input {...register("addressLine1")} />
            </Form.Field>
            <Form.Field label="Address Line 2">
              <input {...register("addressLine2")} />
            </Form.Field>
            <Form.Field label="City">
              <input {...register("city")} />
            </Form.Field>
            <Form.Field label="State">
              <input {...register("state")} />
            </Form.Field>
            <Form.Field label="Zip">
              <input {...register("zipCode")} />
            </Form.Field>
            <Form.Field label="Phone">
              <input {...register("phone")} />
            </Form.Field>
            <Form.Field label="Email">
              <input {...register("email")} />
            </Form.Field>
          </Form.Container>
          <Button type="submit">Create Shelter</Button>
        </form>
      </div>
    </Modal>
  );
};

export default CreateShelterModal;
