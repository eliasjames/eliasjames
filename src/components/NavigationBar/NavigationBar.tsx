import styles from "./NavigationBar.module.css";
import React, { Fragment, useCallback, useState } from "react";
import Link from "next/link";
import classNames from "classnames";
import Button from "@mui/material/Button";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AppsIcon from "@mui/icons-material/Apps";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Collapse, useMediaQuery } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import UserMenu from "./UserMenu";
import AppsMenu from "./AppsMenu";

export default function NavigationBar({
  selectedAppId,
  secondaryTitle,
}: {
  selectedAppId?: string;
  secondaryTitle?: string;
}) {
  const isMobile = useMediaQuery("(max-width:720px)");
  const shortenTitle =
    useMediaQuery("(max-width:420px)") && secondaryTitle != null;
  const shortenBFAS = useMediaQuery("(max-width:375px)");

  const [isAppMenuExpanded, setIsAppModeExpanded] = useState<boolean>(false);
  const handleToggleAppMode = useCallback(
    () => setIsAppModeExpanded(!isAppMenuExpanded),
    [isAppMenuExpanded]
  );

  const [isUserMenuExpanded, setIsUserMenuExpanded] = useState<boolean>(false);
  const handleToggleUserMenu = useCallback(
    () => setIsUserMenuExpanded(!isUserMenuExpanded),
    [isUserMenuExpanded]
  );

  const session = useSession();
  const router = useRouter();
  const hasShelter = router.query.shelterId != null;

  return (
    <div className={styles.navigation}>
      <div className={styles["primary"]}>
        <Button
          href="/"
          LinkComponent={Link}
          className={classNames(styles["app-icon"], styles["home-icon"])}
        >
          <img
            src={"/images/app_logo_orange.png"}
            className={styles["app-icon-image"]}
          />
        </Button>
        <div className={styles["app-title"]}>
          <div className={styles.title}>
            <a href="/" className={styles["home-link"]}>
              {shortenTitle ? "..." : "Project Tailwind"}
            </a>

            {secondaryTitle && (
              <Fragment>
                <ChevronRightIcon className={styles.chevron} />
                <div className={styles["secondary-title"]}>
                  {secondaryTitle}
                </div>
              </Fragment>
            )}
          </div>
          <div className={styles["sub-title"]}>
            Powered by{" "}
            {shortenBFAS ? "Best Friends" : "Best Friends Animal Society"}
          </div>
        </div>
        <div className={styles.actions}>
          {hasShelter && (
            <Button
              onClick={handleToggleAppMode}
              className={classNames(styles["app-icon"], {
                [styles.selected]: isAppMenuExpanded,
                [styles["app-icon"]]: isMobile,
              })}
            >
              <AppsIcon />
            </Button>
          )}
          <div onClick={handleToggleUserMenu} className={styles["user-button"]}>
            {session.data?.user?.image ? (
              <img
                src={session.data?.user?.image ?? undefined}
                className={styles["user-image"]}
                onClick={handleToggleUserMenu}
              />
            ) : (
              <AccountCircleIcon />
            )}
          </div>
        </div>
      </div>
      <Collapse in={isAppMenuExpanded}>
        <AppsMenu selectedAppId={selectedAppId} />
      </Collapse>
      <Collapse in={isUserMenuExpanded}>
        <UserMenu
          isAuthenticated={session.status === "authenticated"}
          user={session.data?.user}
        />
      </Collapse>
    </div>
  );
}
