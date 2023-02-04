import { Box, Typography } from "@mui/material";
import { ERole } from "@utils/constants";
import React, { useState, useTransition } from "react";
import AppLoginSocial from "../components/AppLoginSocial";
import { FormCreateSession } from "@components/Form/FormCreateSession";
import { FormLogin } from "@components/Form/FormLogin";

const Login = () => {
  const [isLoading, startTransition] = useTransition();

  const [tab, setTab] = useState("about");

  function selectTab(nextTab) {
    // startTransition(() => {
    //   setTab(nextTab);
    // });

    Notification.requestPermission().then((perm) => {
      if (perm == "granted") {
        new Notification("Notification", {
          body: "Hello",
          icon: "https://wagmi.com/favicon.ico",
          tag: "Welcome message",
        });
      }
    });
  }

  return (
    <Box
      sx={{
        padding: 0,
        margin: 0,
        width: "100%",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgb(42, 53, 87)",

        textAlign: "center",
      }}
    >
      <Box
        sx={{
          padding: 10,
        }}
      >
        <Box>
          <Typography color={"white"} variant="h4" textAlign={"center"} pb={3}>
            Welcome to Wagmi! Please login to continue.
          </Typography>
        </Box>
        <Box
          margin={"auto"}
          display={"flex"}
          alignItems="center"
          justifyContent={"center"}
          gap={2}
          padding={20}
        >
          <Box sx={{}}>
            <FormLogin />
          </Box>
          <AppLoginSocial />
        </Box>
      </Box>
    </Box>
  );
};

Login.role = ERole.NO_AUTH;

export default Login;
