import React, { memo } from "react";
import { List, Paper } from "@material-ui/core";

import TopicListItem from "./TopicListItem";

const TopicList = memo(props => (
  <>
    {props.items.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <List style={{ overflow: "auto" }}>
          {props.items.map((todo, idx) => { 
              return <TopicListItem
              text={todo}
              key={`TodoItem.${idx}`}
              divider={idx !== props.items.length - 1}
              onButtonClick={() => props.onItemRemove(idx)}
              onCheckBoxToggle={() => props.onItemCheck(idx)}
            />
          })}
        </List>
      </Paper>
    )}
  </>
));

export default TopicList;
