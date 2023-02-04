import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import NextHead from "next/head";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";

import AuthGuard from "@guards/AuthGuard";
import NoAuthGuard from "@guards/NoGuard";
import { Container, ThemeProvider } from "@mui/material";
import { ERole } from "@utils/constants";
import { useEffect, useState } from "react";
import "../styles/cat.scss";
import "../styles/global.css";
import darkTheme from "../theme/darkTheme";
import { chains, client } from "../wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalModal from "@views/GlobalModal";

function App({ Component, pageProps }) {
  const Guard = (() => {
    const currentRole = Component.role || null;
    switch (true) {
      case currentRole === ERole.NO_AUTH:
        return NoAuthGuard;
      default:
        return AuthGuard;
    }
  })();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // useEffect(() => {
  //   // @ts-ignore
  //   const go = new window["Go"]();
  //   window.WebAssembly.instantiateStreaming(
  //     fetch("/static/json.wasm", {
  //       headers: {
  //         "Content-Type": "application/wasm",
  //       },
  //     }),
  //     go.importObject
  //   ).then((result) => {
  //     go.run(result.instance);

  //     if ("serviceWorker" in navigator) {
  //       window.addEventListener("load", function () {
  //         navigator.serviceWorker.register("/sw.js").then(
  //           function (registration) {
  //             console.log(
  //               "Service Worker registration successful with scope: ",
  //               registration.scope
  //             );
  //           },
  //           function (err) {
  //             console.log("Service Worker registration failed: ", err);
  //           }
  //         );
  //       });
  //     }
  //   });
  // });

  const AppContent = (
    <Guard>
      <Container>
        <Component {...pageProps} />
        <GlobalModal />
      </Container>
    </Guard>
  );

  return (
    <WagmiConfig client={client}>
      <QueryClientProvider client={new QueryClient()}>
        <RainbowKitProvider chains={chains}>
          <NextHead>
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script src={"/static/wasm_exec.js"} type="text/javascript" />
            <title>My wagmi + RainbowKit App</title>
          </NextHead>
          <ThemeProvider theme={darkTheme}>
            {mounted && <>{AppContent}</>}
          </ThemeProvider>
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
