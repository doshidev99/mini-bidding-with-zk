import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "next/image";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  p: 4,
  display: "flex",
  alignItems: "center",
  color: "#fff",
  backgroundColor: "rgb(19, 32, 61)",
  borderRadius: 2,
  zIndex: 2000,
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
};

export default function AppModalDetail({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onToggle}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Box display={"flex"} gap={2}>
            <Box>
              <div className="box-card__img">
                <Image
                  src={"/assets/img/badge.svg"}
                  alt="Sismo"
                  width={200}
                  height={200}
                />
              </div>
            </Box>

            <Box>
              <Typography variant="subtitle1">#15151111</Typography>
              <Typography py={2}>ENS Supporter ZK Badge</Typography>
              <Typography variant="subtitle2">
                Created by logoTwitter-fill-blue0 @sismo_eth ZK Badge owned by
                Sismo contributors. This Badge is used in Sismo Governance for
                contributors to voice their opinions.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
