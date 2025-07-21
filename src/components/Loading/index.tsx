import React, { FC } from "react";
import styles from "./Loading.module.scss";
import cn from "classnames";

interface LoadingProps {
  text?: string;
  subtext?: string;
  isFullScreen?: boolean;
}

export const Loading: FC<LoadingProps> = ({
  text = "Загрузка...",
  subtext,
  isFullScreen,
}) => (
  <div
    className={cn(styles.loadingContainer, {
      [styles.fullScreen]: isFullScreen,
    })}
  >
    <div className={styles.spinner}></div>
    <div className={styles.loadingText}>{text}</div>
    {subtext && <div className={styles.loadingSubtext}>{subtext}</div>}
  </div>
);

export default Loading;
