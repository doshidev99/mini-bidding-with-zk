import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { authService } from "@services/auth0Service";
import Image from "next/image";
import { useState } from "react";
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const AppHeader = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem>
                <Typography onClick={authService.logout} textAlign="center">
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          {/* <ConnectButton /> */}
        </Box>
      </Box>
    </div>
  );
};
export default AppHeader;
