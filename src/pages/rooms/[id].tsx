import CloseRoom from "@components/AppModal/CloseRoom";
import ModalAddWhiteList from "@components/AppModal/ModalAddWhiteList";
import ModalJoinRoom from "@components/AppModal/ModalJoinRoom";
import OpenRoom from "@components/AppModal/OpenRoom";
import UpdateDuration from "@components/AppModal/UpdateDuration";
import ListUserBidding from "@components/ListUserBidding";
import ResultRoomTable from "@components/ResultRoomTable";
import WhiteListTable from "@components/WhiteListTable";
import { useToggle } from "@hooks/useToggle";
import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import { useDetailInRoom } from "@services/roomService";
import { useStoreDataRoom } from "@store/useStoreDataRoom";
import { useStoreProfile } from "@store/useStoreProfile";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import Countdown from "react-countdown";

const RoomDetail = () => {
  const { query } = useRouter();
  const [currentTab, setCurrentTab] = useState(1);
  const [currenTabLeft, setCurrentTabLeft] = useState(1);
  const [isOpen, onOpen] = useToggle(true);
  const [openJoinRoom, toggleJoinRoom] = useToggle();
  const [openAddWhiteList, toggleAddWhiteList] = useToggle();
  const { profile } = useStoreProfile();

  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [open, toggle] = useToggle();
  const [openDuration, toggleDuration] = useToggle();
  const [closeRoom, toggleCloseRoom] = useToggle();

  const { data } = useDetailInRoom([open, closeRoom, openAddWhiteList]);

  const currentRoom = useMemo(() => {
    return data && data.roomDetail;
  }, [data]);

  const userIsBidding = useMemo(() => {
    return data && profile && data.keyByUserBidding.includes(profile.auth_user);
  }, [data, profile]);

  const renderComponent = () => {
    if (currentTab == 1 && currentRoom?.status == "ready") {
      return (
        <Box pt={3} className="vault-content">
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
      );
    }

    if (currentRoom?.status == "close") {
      return (
        <Box pt={3} className="vault-content">
          {currentRoom?.result?.length > 0 ? (
            <ResultRoomTable currentResult={currentRoom.result || []} />
          ) : (
            <Typography fontSize={14}>
              There is no result for this room yet. Please wait for the
            </Typography>
          )}
        </Box>
      );
    }

    if (currentTab == 2) {
      return (
        <Box pt={3} className="vault-content">
          <Button
            sx={{
              minWidth: 170,
            }}
            variant="outlined"
            onClick={toggleDuration}
          >
            Update duration
          </Button>
        </Box>
      );
    }
  };

  const renderComponent2 = () => {
    switch (currenTabLeft) {
      case 1:
        return (
          <Box className="vault-content">
            <Box>
              {currentRoom?.whitelist?.length > 0 && (
                <WhiteListTable whiteList={currentRoom?.whitelist || []} />
              )}
            </Box>
          </Box>
        );
    }
  };

  console.log(profile, "profile");

  return (
    <div className="container">
      <OpenRoom open={open} toggle={toggle} />
      <CloseRoom open={closeRoom} toggle={toggleCloseRoom} />
      <UpdateDuration
        open={openDuration}
        toggle={toggleDuration}
        duration={currentRoom?.duration_time}
      />

      <ModalJoinRoom
        open={openJoinRoom}
        toggle={toggleJoinRoom}
        roomId={+query.id}
      />
      <ModalAddWhiteList open={openAddWhiteList} toggle={toggleAddWhiteList} />

      <Box display={"flex"} gap={2}>
        <div className="box-contributor">
          {fetching && !currentRoom ? (
            <Skeleton height={"100%"} />
          ) : (
            <>
              <div className="box-vault-flex">
                {currentRoom?.tree_id != 0 && (
                  <div className={`box-vault ${isOpen && "open"}`}>
                    <Box>
                      <Box pt={2} pl={2}>
                        Room Action
                      </Box>
                      <div>
                        <Box display={"flex"} pt={4}>
                          <Box
                            onClick={() => setCurrentTab(1)}
                            className={`vault-tab ${
                              currentTab == 1 && "active"
                            } `}
                          >
                            Action..
                          </Box>
                          {currentRoom?.status == "ready" && (
                            <Box
                              onClick={() => setCurrentTab(2)}
                              className={`vault-tab ${
                                currentTab == 2 && "active"
                              } `}
                            >
                              Update duration
                            </Box>
                          )}
                        </Box>
                        {renderComponent()}
                      </div>

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

              {currentRoom?.tree_id != 0 && (
                <>
                  <div className="box-vault-flex">
                    <div className={`box-vault left ${isOpen && "open"}`}>
                      <Box>
                        <div>
                          <Box display={"flex"}>
                            <Box
                              onClick={() => setCurrentTabLeft(1)}
                              className={`vault-tab ${
                                currenTabLeft == 1 && "active"
                              } `}
                            >
                              White list
                            </Box>
                          </Box>
                          {renderComponent2()}
                        </div>
                      </Box>
                    </div>
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
                </>
              )}

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

              {userIsBidding ? (
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
                      {currentRoom?.tree_id != 0 ? (
                        <Box>
                          <Box>
                            {currentRoom?.status == "ready" && (
                              <Typography color={"secondary"}>
                                Waiting room to open...
                              </Typography>
                            )}
                          </Box>
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

                    <Box textAlign={"center"} pt={2}>
                      {currentRoom?.status == "open" && (
                        <Box>
                          <Typography>Bid after: </Typography>
                          <Countdown date={currentRoom.start_time * 1000}>
                            <Button
                              variant="outlined"
                              onClick={toggleJoinRoom}
                              startIcon={
                                isLoading && (
                                  <CircularProgress size={20} color="inherit" />
                                )
                              }
                            >
                              Join room
                            </Button>
                          </Countdown>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {currentRoom?.status == "open" && (
                    <Box textAlign={"center"}>
                      <Typography>Room close after: </Typography>
                      <Countdown
                        date={
                          currentRoom.start_time * 1000 +
                          currentRoom.duration_time * 1000
                        }
                      >
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
                      </Countdown>
                    </Box>
                  )}
                </>
              )}
              {/* <div className="text-center">ENS Supporter ZK Badge</div> */}
            </>
          )}
        </div>
      </Box>
      <Box my={2}>
        <ListUserBidding />
      </Box>
    </div>
  );
};

export default RoomDetail;
