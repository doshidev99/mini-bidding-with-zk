import { ModalUserBidding } from "@components/AppModal/ModalUserJoinRoom";
import ListUserBidding from "@components/ListUserBidding";
import { useToggle } from "@hooks/useToggle";
import { Box, Button, Modal, Skeleton } from "@mui/material";
import { useGetRoomByGuest } from "@services/roomService";
import { useStoreProfile } from "@store/useStoreProfile";
import Image from "next/image";
import { useRouter } from "next/router";
import Countdown from "react-countdown";

const GuestRoom = () => {
  const [openDetailRoom, toggleDetailRoom] = useToggle();
  const [openBid, toggleBid] = useToggle(false);
  const { data: currentRoom } = useGetRoomByGuest();

  return (
    <div className="container">
      <Box display={"flex"} gap={2}>
        <div className="box-contributor">
          {!currentRoom ? (
            <Skeleton height={"100%"} />
          ) : (
            <>
              <div>
                <div className="text-left">
                  <span
                    style={{
                      fontSize: 24,
                    }}
                  >
                    {currentRoom?.name}
                  </span>{" "}
                  <br />
                  id:
                  {currentRoom?.id}
                </div>
              </div>
              <div className="box-card__img">
                <Image
                  src={"/assets/img/badge.svg"}
                  alt="Sismo"
                  width={200}
                  height={200}
                />
              </div>

              {currentRoom.status == "open" && (
                <Box textAlign={"center"} pt={2}>
                  <Box>
                    {/* <Typography>Bid after: </Typography> */}
                    <Countdown date={currentRoom.start_time * 1000}>
                      <Button variant="outlined" onClick={toggleBid}>
                        Bid
                      </Button>
                    </Countdown>
                  </Box>
                </Box>
              )}

              <Box
                onClick={toggleDetailRoom}
                sx={{
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                Room detail
              </Box>
              <ModalUserBidding open={openBid} toggle={toggleBid} />

              <Modal open={openDetailRoom} onClose={toggleDetailRoom}>
                <Box>
                  <Box
                    sx={{
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
                    }}
                  >
                    <Box>Description: {currentRoom?.info?.description}</Box>
                    <Box>Phone: {currentRoom?.info?.phone}</Box>
                    <Box>Ws: {currentRoom?.info?.website}</Box>
                  </Box>
                </Box>
              </Modal>
            </>
          )}
        </div>
      </Box>
      <Box my={2}>
        <ListUserBidding currentResult={currentRoom?.result || []} />
      </Box>
    </div>
  );
};

export default GuestRoom;
