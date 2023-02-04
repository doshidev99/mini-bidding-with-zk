import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import * as React from "react";

export default function WhiteListTable({ whiteList }) {
  return (
    <Box>
      <Typography>White List:</Typography>
      <List sx={{ width: "100%", borderRadius: 5 }}>
        {whiteList?.map((item, idx) => {
          return (
            <>
              <ListItem key={idx} alignItems="flex-start">
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
