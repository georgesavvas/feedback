import "react-quill/dist/quill.bubble.css";
import "./quill.css";

import { Button, Chip, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import React, { useEffect } from "react";

import CommentIcon from "@mui/icons-material/Comment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ReactQuill from "react-quill";
import { enqueueSnackbar } from "notistack";
import {hexToHsl} from "../../utils/hexToHsl";
import { serverRequest } from "../../services";
import stc from "string-to-color";
import styles from "./Feedback.module.css";
import timeAgo from "../../utils/timeAgo";
import { useState } from "react";

const getDelay = s => {
  switch (true) {
    case s < 60:
      return 5000;
    case s < 60 * 60:
      return 1000 * 60;
    case s < 60 * 60 * 24:
      return 1000 * 60 * 60;
    default:
      return -1;
  }
};

const Feedback = props => {
  const [updateTime, setUpdateTime] = useState(0);
  const [settingsMenu, setSettingsMenu] = useState(null);
  const {service, kind, data, onClick, forceUpdate, reader, columns, isAdmin} = props;
  const {user, content, comments, tags, created} = data;

  useEffect(() => {
    if (!created) return;
    const now = new Date().getTime() / 1000;
    const secondsAgo = Math.round(now - created);
    const newDelay = getDelay(secondsAgo);
    const timeout = setTimeout(() => {
      if (newDelay > 0) {
        setUpdateTime(prev => prev + 1);
      }
    }, newDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, [updateTime, data]);

  const createdFormatted = timeAgo(created, 3, 1);

  const handleDelete = e => {
    const _data = {
      service: service,
      kind: kind,
      post_id: data.id,
      user: props.reader,
    };
    serverRequest("delete_post", _data).then(() => forceUpdate());
    setSettingsMenu(null);
  };

  const handleChangeState = status => {
    const _data = {
      service: service,
      kind: kind,
      post_id: data.id,
      status: status,
      user: reader,
    };
    serverRequest("update_post", _data).then(resp => {
      if (!resp.ok) enqueueSnackbar(
        "There was an issue changing the status of this post",
        {variant: "error"}
      );
      forceUpdate();
    });
    setSettingsMenu(null);
  };

  const handleSettingsMenuClick = e => {
    e.stopPropagation();
    setSettingsMenu(e.currentTarget);
  };

  const getColumnSettingsOptions = () => {
    return columns.filter(column => column.status !== data.status).map(column =>
      <MenuItem key={column.status} onClick={() => handleChangeState(column.status)}>
        {column.title}
      </MenuItem>
    );
  };

  return (
    <>
      <Menu
        MenuListProps={{style: {padding: "4px 0"}}}
        anchorEl={settingsMenu}
        open={settingsMenu !== null}
        onClose={() => setSettingsMenu(null)}
      >
        {getColumnSettingsOptions()}
        <MenuItem key="delete" onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      <div className={styles.container} onClick={onClick}>
        <Typography
          variant="h6"
          className={styles.title}
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
          }}
        >
          {content?.title}
        </Typography>
        <div className={styles.contentContainer}>
          <ReactQuill readOnly value={content?.description} theme="bubble" className="cursor-pointer shorten" />
        </div>
        <Typography color="grey">
          {createdFormatted} by {user.name}
        </Typography>
        <div className={styles.bottomBar}>
          <div className={styles.tagsContainer}>
            {tags.map(tag =>
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{backgroundColor: hexToHsl(stc(tag), 80, 30)}}
              />
            )}
          </div>
          <div className={styles.bottomButtonsContainer}>
            <Typography color="grey">{comments?.length}</Typography>
            <CommentIcon sx={{color: "grey"}} />
            {isAdmin &&
              <IconButton onClick={handleSettingsMenuClick} size="small" sx={{p: 0}}>
                <MoreHorizIcon sx={{color: "grey"}} />
              </IconButton>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;
