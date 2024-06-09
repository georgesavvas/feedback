import React from "react";
import { Typography } from "@mui/material";
import styles from "./Column.module.css";

const Column = props => {
  return (
    <div className={styles.container}>
      <Typography variant="h6" textAlign="center">
        {props.title}
      </Typography>
      <div style={{backgroundColor: props.color, height: "3px", marginBottom: "5px"}} />
      <div className={styles.column}>
        {props.children}
      </div>
    </div>
  );
};

export default Column;
