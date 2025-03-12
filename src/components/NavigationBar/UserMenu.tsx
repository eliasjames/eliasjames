import styles from "./NavigationBar.module.css";
import React, { Fragment } from "react";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { signIn, signOut } from "next-auth/react";

export default function UserMenu({
  isAuthenticated,
  user,
}: {
  isAuthenticated?: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  return (
    <div className={styles["apps-list"]}>
      {isAuthenticated ? (
        <Fragment>
          {user?.name != null && (
            <div className={styles["user-info"]}>{user?.name}</div>
          )}
          <div className={styles["user-info"]}>{user?.email}</div>
          <div className={styles["horizontal-divider"]} />
          <Button
            className={styles["auth-button"]}
            onClick={async () => {
              await signOut();
            }}
          >
            <LogoutIcon />
            Sign out
          </Button>
        </Fragment>
      ) : (
        <Button
          className={styles["auth-botton"]}
          onClick={async () => {
            await signIn();
          }}
        >
          Sign In
        </Button>
      )}
    </div>
  );
}
