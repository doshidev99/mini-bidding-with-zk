import { zkApi } from "@api/zkApi";
import ModalAddWhiteList from "@components/AppModal/ModalAddWhiteList";
import ModalJoinRoom from "@components/AppModal/ModalJoinRoom";
import ResultRoomTable from "@components/ResultRoomTable";
import WhiteListTable from "@components/WhiteListTable";
import { useToggle } from "@hooks/useToggle";
import { Box, Button, CircularProgress, Skeleton } from "@mui/material";
import { useStoreDataRoom } from "@store/useStoreDataRoom";
import { LocalStorage } from "@utils/newLocalstorage";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";
import { toast } from "react-hot-toast";

const RoomDetail = () => {
  const { query } = useRouter();
  const [currentTab, setCurrentTab] = useState(1);
  const [isOpen, onOpen] = useToggle();
  const [openJoinRoom, toggleJoinRoom] = useToggle();
  const [openAddWhiteList, toggleAddWhiteList] = useToggle();

  const [openResult, toggleResult] = useToggle();
  const { bid_data, proof_id, updateDetailRoom, currentRoom } =
    useStoreDataRoom();

  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [currentResult, setCurrentResult] = useState([]);

  useEffect(() => {
    const getRoomDetail = async () => {
      if (!query.id) return;
      setFetching(true);
      try {
        const _data = await zkApi.getRoomById(query.id);
        updateDetailRoom(_data);
      } catch (e) {}
      setFetching(false);
    };

    getRoomDetail();
  }, [query.id, updateDetailRoom]);

  const renderComponent = () => {
    switch (currentTab) {
      case 1:
        return (
          <Box pt={3} className="vault-content">
            0x000000000
          </Box>
        );
      case 2:
        return (
          <Box pt={3} className="vault-content">
            No imported destinations
          </Box>
        );
    }
  };

  const onBidding = async () => {
    const localData = LocalStorage.get("proof");
    const payload = {
      room_id: +query.id,
      proof_id: proof_id || localData.proofId,
      bid_data: bid_data || localData.bid_data,
    };

    try {
      setIsLoading(true);
      await zkApi.bidding(payload);
      toast.success("Bidding successfully!");
    } catch (e) {
      toast.error(e.message);
    }
    setIsLoading(false);
  };

  const handleResult = async () => {
    try {
      const data = await zkApi.getResultByRoom({
        room_id: +query.id,
      });
      setCurrentResult(data);
      toggleResult();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const timeCountDown = useMemo(
    () =>
      currentRoom
        ? currentRoom.start_time * 1000 + currentRoom.duration_time
        : 0,
    [currentRoom]
  );

  return (
    <div className="container">
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
                <div className={`box-vault ${isOpen && "open"}`}>
                  <Box>
                    <Box pt={2} pl={2}>
                      My Sismo vault
                    </Box>
                    <div>
                      <Box display={"flex"} pt={4}>
                        <Box
                          onClick={() => setCurrentTab(1)}
                          className={`vault-tab ${
                            currentTab == 1 && "active"
                          } `}
                        >
                          Sources
                        </Box>
                        <Box
                          onClick={() => setCurrentTab(2)}
                          className={`vault-tab ${
                            currentTab == 2 && "active"
                          } `}
                        >
                          Destinations
                        </Box>
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
              <Box pb={2} textAlign="center">
                <Box
                  sx={{
                    margin: "0 auto",
                    paddingTop: 4,
                  }}
                >
                  {currentRoom?.tree_id != 0 ? (
                    <Box>
                      {currentRoom?.status == "open" && (
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={toggleJoinRoom}
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

                <Box textAlign={"center"} pt={2}>
                  {currentRoom?.status == "open" &&
                    !!currentRoom?.start_time && (
                      <Countdown date={timeCountDown}>
                        <Button
                          variant="outlined"
                          onClick={onBidding}
                          startIcon={
                            isLoading && (
                              <CircularProgress size={20} color="inherit" />
                            )
                          }
                        >
                          Bidding
                        </Button>
                      </Countdown>
                    )}
                </Box>
              </Box>
              <div className="text-center">ENS Supporter ZK Badge</div>
            </>
          )}

          {currentRoom?.status == "close" && (
            <Box pt={2} textAlign="center">
              <Button
                variant="outlined"
                onClick={handleResult}
                startIcon={
                  isLoading && <CircularProgress size={20} color="inherit" />
                }
              >
                Show result
              </Button>
            </Box>
          )}
        </div>

        {currentRoom?.whitelist.length > 0 && (
          <WhiteListTable whiteList={currentRoom?.whitelist || []} />
        )}

        {currentResult?.length > 0 && (
          <ResultRoomTable
            currentResult={currentResult || []}
            open={openResult}
            toggle={toggleResult}
          />
        )}
      </Box>
    </div>
  );
};

export default RoomDetail;
