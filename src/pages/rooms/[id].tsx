import ModalJoinRoom, {
  ModalBidding,
} from "@components/AppModal/ModalJoinRoom";
import ListUserBidding from "@components/ListUserBidding";
import { useToggle } from "@hooks/useToggle";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { useDetailInRoom } from "@services/roomService";
import { useStoreDataInRoom } from "@store/useStoreDataInRoom";
import { useStoreModal } from "@store/useStoreModal";
import { useStoreProfile } from "@store/useStoreProfile";
import { LocalStorage } from "@utils/newLocalstorage";
import WhiteListInRoom from "@views/DetailRoom/components/WhiteListInRoom";
import { keys } from "lodash-es";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import Countdown from "react-countdown";

const RoomDetail = () => {
  const { query } = useRouter();
  const [isOpen, onOpen] = useToggle();
  const [openJoinRoom, toggleJoinRoom] = useToggle();
  const [openBidding, toggleBidding] = useToggle();

  useDetailInRoom();

  const {
    toggleOpenAddWhiteList,
    toggleOpenUpdateDurationTime,
    toggleOpenRoom,
    toggleCloseRoom,
  } = useStoreModal();
  const { profile } = useStoreProfile();
  const { isLoadingDetailInRoom, currentRoom, isOwner } = useStoreDataInRoom();

  const isJoinRoom = useMemo(() => {
    const _prevDataJoinRoom = LocalStorage.get("dataSaveToStorage");
    return (
      _prevDataJoinRoom &&
      profile &&
      keys(_prevDataJoinRoom).includes(profile.auth_user + query.id)
    );
  }, [profile, query.id]);

  return (
    <div className="container">
      <ModalJoinRoom
        open={openJoinRoom}
        toggle={toggleJoinRoom}
        roomId={+query.id}
      />

      <Box display={"flex"} alignItems="flex-start" gap={2}>
        <Box
          className="box-contributor"
          sx={{
            minWidth: 300,
          }}
        >
          {isLoadingDetailInRoom ? (
            <Skeleton height={"100%"} />
          ) : (
            <>
              <div className="box-vault-flex">
                {currentRoom?.tree_id != 0 && (
                  <div className={`box-vault ${isOpen && "open"}`}>
                    <Box>
                      <div
                        className={`vault-transform`}
                        onClick={onOpen}
                        style={{
                          top: 0,
                        }}
                      >
                        <Image
                          className={`vault-transform__img ${isOpen && "open"}`}
                          src={"/assets/img/arrow.svg"}
                          alt="Sismo"
                          width={14}
                          height={14}
                        />
                      </div>
                    </Box>
                  </div>
                )}

                {!isOpen && (
                  <div className={`vault-transform`} onClick={onOpen}>
                    <Image
                      className={`vault-transform__img ${isOpen && "open"}`}
                      src={"/assets/img/arrow.svg"}
                      alt="Sismo"
                      width={14}
                      height={14}
                    />
                  </div>
                )}
              </div>

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

              {false ? (
                <Typography textAlign={"center"}>User Bided</Typography>
              ) : (
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

                                <Button
                                  variant="outlined"
                                  onClick={toggleOpenRoom}
                                >
                                  Open room
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  {query?.id && (
                    <ModalBidding
                      open={openBidding}
                      toggle={toggleBidding}
                      roomId={query?.id}
                    />
                  )}
                </>
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
                  {/* <Box>
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
                  </Box> */}
                </>
              </Countdown>
            </Box>
          )}

          <Button variant="outlined">Join room</Button>
        </Box>

        <Box
          sx={{
            width: "100%",
          }}
        >
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

          {currentRoom?.duration_time && currentRoom.status == "ready" && (
            <Box className="box-app" mt={2}>
              <Box display={"flex"} alignItems="center" gap={2}>
                <Typography>
                  Duration Time: {currentRoom?.duration_time * 1000}s
                </Typography>

                <Button
                  variant="outlined"
                  onClick={toggleOpenUpdateDurationTime}
                >
                  Update Duration
                </Button>
              </Box>
            </Box>
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
