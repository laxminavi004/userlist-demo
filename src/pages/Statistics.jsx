import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

export default function Statistics({ urls }) {
  return (
    <List>
      {urls.map((u, i) => (
        <ListItem key={i}>
          <ListItemText
            primary={`/${u.shortcode}`}
            secondary={`Original: ${u.original} • Expires in: ${u.expiry} min`}
          />
        </ListItem>
      ))}
    </List>
  );
}
