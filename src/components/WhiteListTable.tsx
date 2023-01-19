import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";

export default function WhiteListTable({ whiteList }) {
  return (
    <Box>
      <Typography>White List</Typography>
      <List sx={{ width: "100%", maxWidth: 400, bgcolor: "background.paper" }}>
        {whiteList?.map((item, idx) => {
          return (
            <>
              <ListItem key={idx} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={item.data.user}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Private Code: {item.data.private_code}
                      </Typography>
                      — Room Id: {item.data.room_id}
                    </React.Fragment>
                  }
                />
              </ListItem>
            </>
          );
        })}
      </List>
    </Box>
  );
}
