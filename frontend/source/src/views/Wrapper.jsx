import React from "react";
import styles from "./Wrapper.module.css";
import {useParams} from "react-router-dom";

const Wrapper = ({children}) => {

  const app = window.location.host.split(".")[0];

  return (
    <>
      {children}
      <div className={styles.bg + " " + styles[app]} />
    </>
  );
};

export default Wrapper;
