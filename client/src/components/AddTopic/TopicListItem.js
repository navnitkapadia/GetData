import React, { memo } from "react";

import {
  ListItem,
  IconButton,
  ListItemText,
  ListItemSecondaryAction
} from "@material-ui/core";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";

const TopicListItem = memo(props => (
  <ListItem divider={props.divider} onClick={props.onListItemClick}>
    <ListItemText primary={props.text} />
    <ListItemSecondaryAction>
      <IconButton aria-label="Delete Todo" onClick={props.onButtonClick}>
        <DeleteOutlined />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
));

export default TopicListItem;
