import { Button } from "@mui/material";
import styles from "./Form.module.css";
import React, { ReactNode } from "react";

export type FieldProps = {
  label: string;
  children: ReactNode;
  isRequired?: boolean;
};

const Field: React.FC<FieldProps> = ({ label, children, isRequired }) => {
  return (
    <div className={styles.field}>
      <label>
        {isRequired && <span className={styles.required}>&#42;</span>}
        {label}
      </label>
      {children}
    </div>
  );
};

export type SubmitProps = {
  onSubmit?: () => void;
  children: ReactNode;
};

const Submit: React.FC<SubmitProps> = ({ onSubmit, children }) => {
  return (
    <Button onClick={onSubmit} type="submit">
      {children}
    </Button>
  );
};

export type MessageProps = {
  children: React.ReactNode;
};

const Message: React.FC<MessageProps> = ({ children }) => {
  return <div className={styles.message}>{children}</div>;
};

export type ContainerProps = {
  children: ReactNode;
};

const Container: React.FC<ContainerProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export const Form = {
  Field,
  Submit,
  Message,
  Container,
};
