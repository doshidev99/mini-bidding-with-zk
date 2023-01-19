import { zkApi } from "@api/zkApi";
import ModalAddWhiteList from "@components/AppModal/ModalAddWhiteList";
import ModalCreateRoom from "@components/AppModal/ModalCreateRoom";
import ModalJoinRoom from "@components/AppModal/ModalJoinRoom";
import BamInput from "@components/Form/BamInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToggle } from "@hooks/useToggle";
import {
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Modal,
  Skeleton,
  Typography,
} from "@mui/material";
import { useRoomService } from "@services/roomService";
import Image from "next/image";
import { useState } from "react";
import Countdown from "react-countdown";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  code: yup.string().required(),
  email: yup.string().required(),
});

const Rooms = () => {
  const { data: roomList, isLoading } = useRoomService();
  const [open, toggle] = useToggle();
  const [currentRoomId, setCurrentRoomId] = useState();
  const [openAddWhiteList, toggleAddWhiteList] = useToggle();
  const [openCreate, toggleCreate] = useToggle();

  if (isLoading)
    return (
      <div className="grid">
        <Skeleton height={600} />
        <Skeleton height={600} />
      </div>
    );

  return (
    <div className="container">
      <Box textAlign={"right"}>
        <Button variant="outlined" color="secondary" onClick={toggleCreate}>
          Create room
        </Button>
      </Box>
      <div className="grid">
        {roomList?.map((room) => {
          const timeCountDown = room.start_time * 1000 + room.duration_time;
          return (
            <Box key={room.id}>
              <div className="box-card">
                <div>
                  <div className="text-left">
                    <span
                      style={{
                        fontSize: 24,
                      }}
                    >
                      Room Id:
                    </span>{" "}
                    {room.id}
                    <br />
                  </div>
                  <Box>
                    <Chip
                      label={room.status}
                      color={`${
                        room.status == "ready" ? "success" : "primary"
                      }`}
                    />
                  </Box>
                </div>
                <div className="box-card__img">
                  <Image
                    src={"/assets/img/badge.svg"}
                    alt="Sismo"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="text-center">{room.name || "Name"}</div>

                <Box
                  sx={{
                    margin: "0 auto",
                    paddingTop: 4,
                  }}
                >
                  {room.tree_id !== 0 ? (
                    <Box>
                      {room.status == "open" && timeCountDown > Date.now() && (
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={() => {
                            toggle();
                            setCurrentRoomId(room.id);
                          }}
                        >
                          Join room
                        </Button>
                      )}
                    </Box>
                  ) : (
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={toggleAddWhiteList}
                    >
                      Add white list
                    </Button>
                  )}
                </Box>

                <Box textAlign={"center"}>
                  <Countdown date={timeCountDown}>
                    <span></span>
                  </Countdown>
                </Box>
              </div>
              <ModalJoinRoom
                open={open}
                toggle={toggle}
                roomId={currentRoomId}
              />
              <ModalAddWhiteList
                open={openAddWhiteList}
                toggle={toggleAddWhiteList}
              />
            </Box>
          );
        })}
      </div>

      {roomList.length == 0 && (
        <Typography textAlign={"center"} color="secondary ">
          Not have room this time
        </Typography>
      )}

      <ModalCreateRoom open={openCreate} toggle={toggleCreate} />
    </div>
  );
};

export default Rooms;
