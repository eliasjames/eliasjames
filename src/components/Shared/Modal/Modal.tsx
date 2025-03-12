import styles from "./Modal.module.css";
import React from "react";
import { Modal as MuiModal } from "@mui/material";

export type ModalProps = {
  isOpen: boolean;
  children?: any;
  onClose?: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, children, onClose }) => {
  return (
    <MuiModal
      open={isOpen}
      onClose={onClose}
      role="dialog"
      className={styles.modal}
    >
      {children}
    </MuiModal>
  );
};

export default Modal;
