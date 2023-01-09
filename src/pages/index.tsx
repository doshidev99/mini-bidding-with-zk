import { Box, Button, CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";
import { FormCreateSession } from "../components/Form/FormCreateSession";
import {
  useCheckHasBidding,
  useGetCurrentSession,
  useZkFunction,
} from "../hooks/useZkFunction";
import { useStoreData } from "../store/useStoreData";

const App = () => {
  const { hasBidding, checkHasBidding } = useCheckHasBidding();
  const { onInitBidding, onJoinRoom } = useZkFunction();
  const [loading, setLoading] = useState(false);
  // const { loading: isLoading } = useGetCurrentSession();
  const { sessionList } = useStoreData();

  const initBidding = () => {
    setLoading(true);
    onInitBidding()
      .then(() => {
        toast("Session initialized");
        checkHasBidding();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!hasBidding)
    return (
      <Box textAlign={"center"}>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          }}
          startIcon={loading && <CircularProgress size={20} />}
          onClick={initBidding}
        >
          Start Bidding
        </Button>
      </Box>
    );
  if (sessionList.roomID == 0) return <FormCreateSession />;

  return (
    <div className="container">
      <div className="grid">
        {[1].map((idx) => {
          return (
            <Box
              // href="/contributor"
              key={idx}
            >
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
                    {sessionList?.roomID}
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
                <div className="text-center">{sessionList?.username}</div>

                <Box
                  sx={{
                    margin: "0 auto",
                    paddingTop: 4,
                  }}
                >
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => onJoinRoom(sessionList.roomID)}
                  >
                    Join room
                  </Button>
                </Box>
              </div>
            </Box>
          );
        })}
      </div>
    </div>
  );
};

export default App;
