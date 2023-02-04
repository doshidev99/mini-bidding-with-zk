import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import * as React from "react";

export default function ResultRoomTable({ currentResult }) {
  return (
    <List sx={{ width: "100%", borderRadius: 5 }}>
      {currentResult?.map((item, idx) => {
        return (
          <ListItem
            key={idx}
            alignItems="flex-start"
            sx={{
              overflow: "auto",
            }}
          >
            {/* <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar> */}
            <ListItemText
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Bidder: {item.bidder}
                  </Typography>
                  <br />
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    User: {item.user}
                  </Typography>
                  — Price: {item.price}
                </React.Fragment>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  color: "#fff",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};
