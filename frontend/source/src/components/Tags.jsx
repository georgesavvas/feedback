import {Autocomplete, Chip, TextField} from "@mui/material";
/* eslint-disable @typescript-eslint/no-empty-function */
import React, {useCallback, useState} from "react";

import {hexToHsl} from "../utils/hexToHsl";
import stc from "string-to-color";
import styles from "./Tags.module.css";

const formatTags = tags => {
  if (!tags) return [];
  return [...new Set(tags)];
};

const Tags = ({tags, setTags, editMode}) => {
  const [tagsWarning, setTagsWarning] = useState(false);

  const handleChange = (_, value) => {
    setTags(value);
    setTagsWarning(false);
  };

  const renderTags = useCallback((tags, getTagProps) => {
    return tags.map((tag, index) =>
      <Chip
        key={tag}
        label={tag}
        size="small"
        sx={{backgroundColor: hexToHsl(stc(tag), 80, 30)}}
        {...getTagProps({index})}
      />
    );
  }, []);

  if (!editMode) return renderTags(tags, () => {});

  return (
    <div className={styles.container}>
      <Autocomplete
        multiple
        size="small"
        freeSolo
        options={[]}
        value={tags}
        onChange={handleChange}
        fullWidth
        renderTags={renderTags}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Tags"
            onChange={e => setTagsWarning(e.target.value !== "")}
            helperText={tagsWarning ? "Press enter to confirm tags" : undefined}
          />
        )}
      />
    </div>
  );
};

export default Tags;
