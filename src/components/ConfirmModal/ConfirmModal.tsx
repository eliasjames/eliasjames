import { Button } from "@mui/material";
import React from "react";
import Modal from "../Shared/Modal/Modal";
import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  title: string;
  message: string;
  onClose?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  onClose,
  onCancel,
  onConfirm,
  isOpen,
  setIsOpen,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className={styles.container}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={styles.buttons}>
          <Button onClick={onCancel}>{cancelButtonText}</Button>
          <Button variant="contained" onClick={onConfirm}>
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
