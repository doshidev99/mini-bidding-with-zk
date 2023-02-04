import ModalUserJoinRoom from "@components/AppModal/ModalUserJoinRoom";
import { useToggle } from "@hooks/useToggle";
import { Box, Button, Chip, Skeleton, Typography } from "@mui/material";
import { useRoomService } from "@services/roomService";
import { useStoreDataRoom } from "@store/useStoreDataRoom";
import { useStoreModal } from "@store/useStoreModal";
import Image from "next/image";
import Link from "next/link";

const Rooms = () => {
  const { isLoading } = useRoomService();
  const { roomList } = useStoreDataRoom();
  const [openJoinRoom, toggleJoinRoom] = useToggle();

  const { toggleOpenCreate } = useStoreModal();

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
        <Box display={"flex"} justifyContent="flex-end" gap={10}>
          <Button
            variant="contained"
            color="secondary"
            onClick={toggleOpenCreate}
          >
            Create room
          </Button>
          {/* 
          <Button variant="outlined" color="primary" onClick={toggleJoinRoom}>
            Join room
          </Button> */}
        </Box>
      </Box>
      <div className="grid">
        {roomList?.map((room) => {
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

                <Box
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <Box>Visibility: {room?.visibility}</Box>
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

      <ModalUserJoinRoom open={openJoinRoom} toggle={toggleJoinRoom} />
    </div>
  );
};

const DetailRoom = () => {
  return <div>hello</div>;
};

export default Rooms;
