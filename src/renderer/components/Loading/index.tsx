import React from "react";
import MemoLoadingIcon from "./LoadingIcon";
import styles from "./style.module.css";

export const Loading: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => {
  return <MemoLoadingIcon style={style} className={styles.loading} />;
};
