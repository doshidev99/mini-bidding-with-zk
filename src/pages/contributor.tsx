import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AppModalDetail from "../components/AppModalDetail";
import { useToggle } from "../hooks/useToggle";

const Contributor = () => {
  const [currentTab, setCurrentTab] = useState(1);
  const [isOpen, onOpen] = useToggle();
  const [openModal, toggleModal] = useToggle();

  const workerRef = useRef();
  // useEffect(() => {
  //   if (workerRef.current === undefined) {
  //     workerRef.current = new Worker(new URL("/public/sw.js", import.meta.url));
  //   }
  // }, []);

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
  return (
    <div className="container">
      <div className="d-flex">
        <button>Click</button>

        <div className="box-contributor">
          <div className="box-vault-flex">
            <div className={`box-vault ${isOpen && "open"}`}>
              <Box pt={2} pl={2}>
                My Sismo vault
              </Box>
              <div>
                <Box display={"flex"} pt={4}>
                  <Box
                    onClick={() => setCurrentTab(1)}
                    className={`vault-tab ${currentTab == 1 && "active"} `}
                  >
                    Sources
                  </Box>
                  <Box
                    onClick={() => setCurrentTab(2)}
                    className={`vault-tab ${currentTab == 2 && "active"} `}
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

          <Typography
            onClick={toggleModal}
            variant="subtitle1"
            textAlign={"center"}
            style={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Badge detail
          </Typography>
          <div className="text-center">ENS Supporter ZK Badge</div>
        </div>
      </div>
      <AppModalDetail open={openModal} onToggle={toggleModal} />
    </div>
  );
};

export default Contributor;
