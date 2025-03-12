import classNames from "classnames";
import styles from "./Pill.module.css";
import React from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

export interface PillProps {
  text: string;
  color?: "green" | "red" | "yellow";
  onEdit?: () => void;
}

const Pill: React.FC<PillProps> = ({ text, color = "green", onEdit }) => {
  return (
    <div>
      <div className={classNames(styles.pill, styles[color])}>
        {text} {onEdit && <ModeEditIcon onClick={onEdit} />}
      </div>
    </div>
  );
};

export default Pill;
