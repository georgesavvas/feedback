import React from "react";
import styles from "./Warehouse.module.css";
import { Typography } from "@mui/material";

const actionList = [
  {
    title: "Docs",
    icon: "/media/docs02.svg",
    href: "http://warehouse.electrictheatre.tv/docs/",
  },
  {
    title: "Feedback",
    icon: "/media/feedback.svg",
    href: "/feedback",
    wip: true,
  },
  {
    title: "Issues",
    icon: "/media/bug_grey.svg",
    href: "/issues",
    wip: true,
  },
];

const Action = ({icon, title, href, wip}) => {
  return (
    <a href={href} style={{textDecoration: "none"}} className={wip ? styles.disabled : ""}>
      <div className={styles.feature}>
        {wip && <div className={styles.wipContainer}><h1>Coming Soon!</h1></div>}
        <div className={`${styles.iconContainer} ${wip ? styles.wip : ""}`}>
          <img src={icon} className={styles.icon + " " + styles[title]} />
        </div>
        <Typography className={`${styles.actionText} ${wip ? styles.wip : ""}`} variant="h4" fontWeight={700} textAlign="center">
          {title}
        </Typography>
      </div>
    </a>
  );
};

export const Warehouse = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <Typography className={styles.title} variant="h1" fontWeight={100}>
          WAREHOUSE
        </Typography>
        <Typography className={styles.subtitle} variant="h4" fontWeight={100}>
          ASSET LIBRARY
        </Typography>
      </div>
      <div className={styles.featureContainer}>
        {actionList.map((props, idx) => (
          <Action key={idx} {...props} />
        ))}
      </div>
      <div className={styles.anim}>
        <div className={styles.bg} />
      </div>
    </div>
  );
};

export default Warehouse;
