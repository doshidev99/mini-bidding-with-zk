import CloseRoom from "@components/AppModal/CloseRoom";
import OpenRoom from "@components/AppModal/OpenRoom";
import { useToggle } from "@hooks/useToggle";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import * as yup from "yup";

const schema = yup.object().shape({
  roomId: yup.number().required("Room ID is required"),
});

const Dashboard = () => {
  const [open, toggle] = useToggle();
  const [closeRoom, toggleCloseRoom] = useToggle();

  return (
    <div>
      <OpenRoom open={open} toggle={toggle} />
      <CloseRoom open={closeRoom} toggle={toggleCloseRoom} />
      
      <Box py={2}>
        <Button
          sx={{
            minWidth: 170,
          }}
          variant="outlined"
          onClick={toggle}
        >
          Open room
        </Button>
      </Box>
      <Box py={2}>
        <Button
          sx={{
            minWidth: 170,
          }}
          variant="outlined"
          onClick={toggleCloseRoom}
        >
          Close room
        </Button>
      </Box>
    </div>
  );
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  color: "#fff",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};
export default Dashboard;
