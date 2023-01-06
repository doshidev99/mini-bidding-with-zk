import { Box } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

const AppHeader = () => {
  return (
    <div
      style={{
        padding: "0 24px",
        color: "#fff",
      }}
    >
      <Box
        display={"flex"}
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Box>
          <Box display={"flex"}>
            <Box>
              <Image
                src="/assets/img/logo.svg"
                alt=""
                width={120}
                height={120}
              />
            </Box>
          </Box>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Box>
    </div>
  );
};
export default AppHeader;
