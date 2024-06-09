import "react-quill/dist/quill.bubble.css";
import "./quill.css";

import {AnimatePresence, motion} from "framer-motion";
import {Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField, Typography} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";

import ReactQuill from "react-quill";
import Tags from "../Tags";
import {serverRequest} from "../../services";
import styles from "./Editor.module.css";
import timeAgo from "../../utils/timeAgo";
import {useSnackbar} from "notistack";
import { v4 as uuidv4 } from "uuid";

const sortComments = (a, b) => {
  return a.created < b.created ? -1 : 1;
};

const Editor = props => {
  const editorRef = useRef();
  const [editMode, setEditMode] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState("todo");
  const {enqueueSnackbar} = useSnackbar();
  const {service, kind, isAdmin, forceUpdate, isLoggedIn} = props;
  const {created, user, content, comments} = props.entry || {};

  useEffect(() => {
    if (!props.open) return;
    if (!props.entry?.id) {
      setEditMode(true);
      return;
    }
    setEditMode(false);
  }, [props.open, props.entry]);

  useEffect(() => {
    if (!props.open) return;
    setTitleValue(content?.title || "");
    setContentValue(content?.description || "");
    setTags(props.entry.tags || []);
    setStatus(props.entry.status || "todo");
  }, [props.entry]);

  if (!props.open) return null;

  const isNew = !props.entry?.id;
  const createdFormatted = timeAgo(created, 3, 1);

  const dialogStyle = {
    "& .MuiDialog-container": {
      "& .MuiPaper-root": {
        height: isNew ? "50vh" : "80vh",
        backgroundColor: "rgb(25, 25, 25)",
        backgroundImage: "none",
      },
    },
  };

  const readerIsAuthor = user && props.reader.username === user.username;
  const column = props.columns.find(column => column.status === status);

  const renderTitle = () => {
    if (editMode) return (
      <TextField
        placeholder="Title"
        fullWidth
        size="small"
        value={titleValue}
        onChange={e => setTitleValue(e.target.value)}
      />
    );
    return (
      <Typography variant="h6">
        {titleValue}
      </Typography>
    );
  };

  const renderContent = () => {
    return (
      <div
        data-color-mode="dark"
        className={`editor-container ${styles.editorContainer}`}
      >
        <ReactQuill
          ref={editorRef}
          readOnly={!editMode}
          className={editMode ? styles.markdownEditor : styles.markdownPreview}
          theme="bubble"
          bounds=".editor-container"
          value={contentValue}
          placeholder="Description"
          onChange={setContentValue}
        />
      </div>
    );
  };

  const handleCommentPost = () => {
    const data = {
      service: service,
      kind: kind,
      post_id: props.entry.id,
      user: props.reader,
      content: commentValue,
    };
    serverRequest("create_comment", data).then(resp => {
      if (!resp.ok) enqueueSnackbar("There was an issue posting your comment :(", {variant: "error"});
      forceUpdate();
    });
    // props.setData(prev => {
    //   const existing = [...prev];
    //   const post = existing.find(post => post.id === props.entry.id);
    //   post.comments.push({id: uuidv4(), user: props.reader, content: commentValue});
    //   return existing;
    // });
    setCommentValue("");
  };

  const renderCommentEditor = () => {
    if (isNew) return null;
    return (
      <div className={styles.comments}>
        <div className={styles.commentsScroll}>
          <AnimatePresence mode="popLayout">
            {comments.sort(sortComments).map((comment, index) =>
              <motion.div
                key={comment.id}
                className={styles.commentContainer}
                layout
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
              >
                <div className={styles.commentHeader}>
                  <Typography color="darkgrey">
                    {timeAgo(comment.created, 3, 1)} by {comment.user.name || "Unknown"}
                  </Typography>
                </div>
                <div
                  data-color-mode="dark"
                  className={`editor-container ${styles.commentContent}`}
                >
                  <ReactQuill readOnly theme="bubble" value={comment.content} />
                </div>
              </motion.div>
              // {/* {index < comments.length - 1 ?
              //   <div key={`${index}-connector`} className={styles.commentConnector} />
              //   : null
              // } */}
            )}
          </AnimatePresence>
        </div>
        <div data-color-mode="dark" className={`editor-container ${styles.editorCommentContainer}`}>
          <ReactQuill
            ref={editorRef}
            className={styles.markdownEditor}
            theme="bubble"
            bounds=".editor-container"
            value={commentValue}
            placeholder="New Comment"
            onChange={setCommentValue}
          />
          {/* <div className={styles.postContainer}> */}
          <Button
            disabled={!commentValue}
            onClick={handleCommentPost}
            variant="outlined"
            color="success"
            sx={{margin: "auto"}}
          >
            Post Comment
          </Button>
          {/* </div> */}
        </div>
      </div>
    );
  };

  const handleCreate = () => {
    const data = {
      kind: kind,
      service: service,
      user: props.reader,
      status: status,
      tags: tags,
      content: {
        title: titleValue,
        description: contentValue,
      },
    };
    serverRequest("create_post", data).then(resp => {
      if (resp.ok) enqueueSnackbar("Feedback created!", {variant: "success"});
      else enqueueSnackbar("There was an issue creating your post :(", {variant: "error"});
      forceUpdate();
    });
    // props.setData(prev => [...prev, {...data, id: uuidv4(), comments: []}]);
    props.onClose();
    setTitleValue("");
    setContentValue("");
  };

  const handleUpdate = () => {
    const data = {
      post_id: props.entry.id,
      kind: kind,
      service: service,
      status: status,
      user: props.reader,
      tags: tags,
      content: {
        title: titleValue,
        description: contentValue,
      },
    };
    serverRequest("update_post", data).then(resp => {
      if (resp.ok) {
        enqueueSnackbar("Updated!", {variant: "success"});
        setEditMode(false);
        forceUpdate();
      }
      else enqueueSnackbar("There was an issue updating this post", {variant: "error"});
    });
    // props.setData(prev => {
    //   const existing = [...prev];
    //   const index = existing.findIndex(post => post.id === props.entry.id);
    //   existing[index] = data;
    //   return existing;
    // });
    // setTitleValue("");
    // setContentValue("");
  };

  return (
    <Dialog
      open={props.open}
      fullWidth
      maxWidth="lg"
      onClose={props.onClose}
      sx={dialogStyle}
    >
      <div className={styles.container}>
        {/* {readerIsAuthor && !editMode ?
          <Button
            color="success"
            variant="outlined"
            sx={{position: "absolute", right: 10, top: 10}}
            onClick={() => setEditMode(true)}
          >
            Edit
          </Button>
        : null} */}
        {renderTitle()}
        {!isNew && <Typography color="grey">
          {createdFormatted} by {user?.name || "Unknown"}
        </Typography>}
        <div className={styles.row}>
          {isAdmin && editMode ? <TextField
            placeholder="Status"
            size="small"
            select
            sx={{minWidth: 150}}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {props.columns.map(column =>
              <MenuItem key={column.status} value={column.status}>
                {column.title}
              </MenuItem>
            )}
          </TextField> : <Typography sx={{minWidth: "max-content", color: column.colour}}>
            {column.title}
          </Typography>
          }
          <Tags tags={tags} setTags={setTags} editMode={editMode} />
        </div>
        <div className={styles.contentContainer}>
          {renderContent()}
        </div>
        <div className={styles.commentsContainer}>
          {!isNew && <Typography variant="h6">
            {comments && comments.length > 0 ? "Comments" : "No comments"}
          </Typography>}
          {isLoggedIn ? renderCommentEditor() : <Typography>Please log in to post</Typography>}
        </div>
        <div className={styles.buttonContainer}>
          <Button color="secondary" variant="outlined" size="small" onClick={props.onClose}>Close</Button>
          {isNew &&
            <Button color="success" variant="outlined" size="small" onClick={handleCreate}>
              Create
            </Button>
          }
          {(isAdmin || readerIsAuthor) && !isNew && editMode &&
            <Button color="success" variant="outlined" size="small" onClick={handleUpdate}>
              Update
            </Button>
          }
          {(isAdmin || readerIsAuthor) && !isNew && !editMode &&
            <Button color="success" variant="outlined" size="small" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          }
        </div>
      </div>
    </Dialog>
  );
};

export default Editor;
