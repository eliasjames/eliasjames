import React from "react";
import styles from "./Tabs.module.css";
import { Skeleton } from "@mui/material";
import classNames from "classnames";

export interface TabData {
  tabName: string;
  tabId: string;
  tabCount?: number | undefined;
  isLoading?: boolean;
}

export function Tabs({
  handleSetTab,
  selectedTab,
  tabData,
}: {
  handleSetTab: (tab: string) => void;
  selectedTab: string;
  tabData: TabData[];
}) {
  return (
    <div className={styles.tabs}>
      {tabData.map((tab) => (
        <Tab
          key={tab.tabId}
          tabData={tab}
          isActive={tab.tabId === selectedTab}
          handleSetTab={() => handleSetTab(tab.tabId)}
        />
      ))}
    </div>
  );
}

function Tab({
  tabData,
  isActive,
  handleSetTab,
}: {
  tabData: TabData;
  isActive: boolean;
  handleSetTab: (tab: string) => void;
}) {
  const { tabName, tabId, tabCount, isLoading } = tabData;

  return (
    <div
      className={classNames(styles.tab, {
        [styles.active]: isActive,
      })}
      onClick={() => handleSetTab(tabId)}
    >
      {tabName}
      {isLoading ? (
        <Skeleton height={24} width={25} variant={"rounded"} />
      ) : tabCount != null ? (
        <div className={styles["tab-tag"]}>{tabCount}</div>
      ) : null}
    </div>
  );
}
