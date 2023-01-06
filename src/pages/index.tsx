import { Box, Button, CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { spawn, Thread } from "threads";
import { useAccount } from "wagmi";
import { useCheckHasBidding, useZkFunction } from "../hooks/useZkFunction";

const App = () => {
  const { address } = useAccount();
  const { hasBidding, checkHasBidding } = useCheckHasBidding();
  const { onInitBidding } = useZkFunction();
  const [loading, setLoading] = useState(false);
  const worker = useRef();

  useEffect(() => {
    if (!worker.current) {
      const load = async () => {
        // @ts-ignore
        worker.current = await spawn(
          new Worker(new URL("/src/worker/hello.ts", import.meta.url))
        );
      };
      load();
    }
    return () => worker.current && Thread.terminate(worker.current);
  }, []);

  function handleBidding() {
    console.log("hello truong");
    window.initBidding();
    return 1;
  }

  const initBidding = () => {
    setLoading(true);
    handleBidding();
    // onInitBidding();
    // .then(() => {
    //   toast("Session initialized");
    //   checkHasBidding();
    // })
    // .finally(() => {
    //   setLoading(false);
    // });
  };

  useEffect(() => {
    if (window.Worker) {
      const myWorker = new Worker("/sw.js");
      const functionString = handleBidding.toString();

      myWorker.postMessage({
        type: "function",
        functionString,
      });
    } else {
      console.log("Your browser doesn't support web workers.");
    }
  }, []);

  if (!address) return null;

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
        <h1
          onClick={async () => {
            const hello = await worker.current?.bidding?.();
            console.log(hello);
          }}
        >
          click test worker
        </h1>
      </Box>
    );

  return (
    <div className="container">
      <div className="grid">
        {[1, 2, 3].map((idx) => {
          return (
            <Link href="/contributor" key={idx}>
              <div className="box-card">
                <div>
                  <div className="text-left">
                    <span
                      style={{
                        fontSize: 24,
                      }}
                    >
                      ENS
                    </span>{" "}
                    X ZK Badge
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
                <div className="text-center">ENS Supporter ZK Badge</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default App;
