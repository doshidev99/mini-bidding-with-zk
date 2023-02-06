import ListUserBidding from "@components/ListUserBidding";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { useDetailInRoom } from "@services/roomService";
import { useStoreDataInRoom } from "@store/useStoreDataInRoom";
import { useStoreModal } from "@store/useStoreModal";
import WhiteListInRoom from "@views/DetailRoom/components/WhiteListInRoom";
import Image from "next/image";
import Countdown from "react-countdown";

const RoomDetail = () => {
  const { isLoading } = useDetailInRoom();

  const {
    toggleOpenAddWhiteList,
    toggleOpenUpdateDurationTime,
    toggleOpenRoom,
    toggleCloseRoom,
    toggleOpenJoinRoom,
    toggleOpenBidding,
    toggleCancelRoom,
  } = useStoreModal();
  const { isLoadingDetailInRoom, currentRoom, isOwner } = useStoreDataInRoom();

  return (
    <div className="container">
      <Box display={"flex"} alignItems="flex-start" gap={2}>
        <Box
          className="box-contributor"
          sx={{
            minWidth: 300,
          }}
        >
          {isLoadingDetailInRoom || isLoading ? (
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

              <>
                <Box pb={2} textAlign="center">
                  <Box
                    sx={{
                      margin: "0 auto",
                      paddingTop: 4,
                    }}
                  >
                    {currentRoom?.tree_id != 0 && (
                      <Box>
                        <Box>
                          {currentRoom?.status == "ready" && (
                            <Box>
                              <Typography color={"secondary"} pb={2}>
                                Waiting room to open...
                              </Typography>

                              {isOwner && (
                                <Button
                                  variant="outlined"
                                  onClick={toggleOpenRoom}
                                >
                                  Open room
                                </Button>
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </>

              {!isOwner &&
              currentRoom?.status == "open" &&
              currentRoom?.start_time == 0 ? (
                <Button variant="outlined" onClick={toggleOpenJoinRoom}>
                  Join room
                </Button>
              ) : (
                <Box textAlign={"center"}>
                  {!isOwner && currentRoom && (
                    <Box>
                      <Box mb={2}>
                        <Countdown
                          date={
                            currentRoom.start_time * 1000 +
                            currentRoom.duration_time * 1000
                          }
                        >
                          <Typography>
                            {currentRoom?.status != "ready" && "Room expired"}{" "}
                          </Typography>
                        </Countdown>
                      </Box>
                      {currentRoom.hasOwnProperty("isBided") && (
                        <>
                          {!currentRoom?.isBided ? (
                            <Button
                              variant="outlined"
                              onClick={toggleOpenBidding}
                            >
                              Bid
                            </Button>
                          ) : (
                            <Typography color={"secondary"}>
                              You have bided
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}

          {currentRoom?.status == "open" && isOwner && (
            <Box textAlign={"center"}>
              <Typography>Room close after: </Typography>
              <Countdown
                date={
                  currentRoom.start_time * 1000 +
                  currentRoom.duration_time * 1000
                }
              >
                <>
                  <Box>
                    {currentRoom.status != "close" && (
                      <Box pt={3} className="vault-content">
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
                    )}
                  </Box>
                </>
              </Countdown>
            </Box>
          )}

          {
            <>
              <Box>
                {isOwner && currentRoom?.status != "cancel" && currentRoom?.status != "open" && (
                  <Box pt={3} textAlign={"center"}>
                    <Button
                      sx={{
                        minWidth: 170,
                      }}
                      variant="outlined"
                      onClick={toggleCancelRoom}
                    >
                      Cancel room
                    </Button>
                  </Box>
                )}
              </Box>
            </>
          }
        </Box>

        <Box
          sx={{
            width: "100%",
          }}
        >
          {currentRoom && (
            <>
              {currentRoom?.tree_id == 0 && (
                <Box mb={2} textAlign="right">
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={toggleOpenAddWhiteList}
                  >
                    Add white list
                  </Button>
                </Box>
              )}

              <Box
                p={3}
                borderRadius={4}
                sx={{
                  fontSize: 14,
                  background: "rgb(19, 32, 61)",
                }}
              >
                <Box>
                  <Typography>Bid Type: {currentRoom?.bid_type}</Typography>
                  <Typography>Creator: {currentRoom?.creator}</Typography>
                  <Typography>Visibility: {currentRoom?.visibility}</Typography>
                </Box>
                {currentRoom?.info && (
                  <Box>
                    <Typography>Website: {currentRoom.info.website}</Typography>
                    <Typography>Phone: {currentRoom.info.phone}</Typography>
                  </Box>
                )}
              </Box>

              <WhiteListInRoom />

              {currentRoom?.duration_time && (
                <Box className="box-app" mt={2}>
                  <Box display={"flex"} alignItems="center" gap={2}>
                    <Typography>
                      Duration Time: {currentRoom?.duration_time}
                    </Typography>

                    {currentRoom.status == "ready" && isOwner && (
                      <Button
                        variant="outlined"
                        onClick={toggleOpenUpdateDurationTime}
                      >
                        Update Duration
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      <Box my={2}>
        <ListUserBidding currentResult={currentRoom?.result || []} />
      </Box>
    </div>
  );
};

export default RoomDetail;
