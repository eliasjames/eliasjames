import styles from "./AnimalId.module.css";
import React, { useCallback, useState } from "react";
import { Snackbar } from "@mui/material";
import CopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";

export function AnimalId({ animalId }: { animalId: string }) {
  const [isSuccessToastOpen, setIsSuccessToastOpen] = useState<boolean>(false);
  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(animalId);
    setIsSuccessToastOpen(true);
  }, [animalId]);

  const handleCloseToast = useCallback(() => {
    setIsSuccessToastOpen(false);
  }, []);

  return (
    <div className={styles["animal-id"]} onClick={(e) => e.stopPropagation()}>
      <span className={styles["animal-id-text"]}>{animalId}</span>
      <CopyIcon
        onClick={handleCopyToClipboard}
        fontSize={"small"}
        className={styles["no-shrink"]}
      />
      <Snackbar
        open={isSuccessToastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        message="Animal ID copied to clipboard"
        action={<CloseIcon onClick={handleCloseToast} color={"primary"} />}
      />
    </div>
  );
}
