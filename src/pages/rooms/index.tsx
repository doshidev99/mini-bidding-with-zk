import ModalCreateRoom from "@components/AppModal/ModalCreateRoom";
import { useToggle } from "@hooks/useToggle";
import { Box, Button, Chip, Skeleton, Typography } from "@mui/material";
import { useRoomService } from "@services/roomService";
import { generateKeyPair } from "@utils/configOpenpgp";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
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

  useEffect(() => {
    generateKeyPair();
  }, []);

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
            <Link href={`/rooms/${room.id}`} key={room.id}>
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

                <Box textAlign={"center"}>
                  <Countdown date={timeCountDown}>
                    <span></span>
                  </Countdown>
                </Box>
              </div>
            </Link>
          );
        })}
      </div>

      {roomList?.length == 0 && (
        <Typography textAlign={"center"} color="secondary ">
          Not have room this time
        </Typography>
      )}

      <ModalCreateRoom open={openCreate} toggle={toggleCreate} />
    </div>
  );
};

const DetailRoom = () => {
  return <div>hello</div>;
};

export default Rooms;
