import React, { FC } from "react";
import styles from "./Loading.module.scss";

interface LoadingProps {
  text?: string;
  subtext?: string;
}

export const Loading: FC<LoadingProps> = ({
  text = "Загрузка...",
  subtext,
}) => (
  <div className={styles.loadingContainer}>
    <div className={styles.spinner}></div>
    <div className={styles.loadingText}>{text}</div>
    {subtext && <div className={styles.loadingSubtext}>{subtext}</div>}
  </div>
);

export default Loading;
