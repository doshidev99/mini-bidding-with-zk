import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";

import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import "../styles/cat.scss";
import "../styles/global.css";
import { chains, client } from "../wagmi";
import { ThemeProvider } from "@mui/material";
import darkTheme from "../theme/darkTheme";

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // @ts-ignore
    const go = new window["Go"]();
    window.WebAssembly.instantiateStreaming(
      fetch("/static/main.wasm", {
        headers: {
          "Content-Type": "application/wasm",
        },
      }),
      go.importObject
    ).then((result) => {
      go.run(result.instance);

      if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
          navigator.serviceWorker.register("/sw.js").then(
            function (registration) {
              console.log(
                "Service Worker registration successful with scope: ",
                registration.scope
              );
            },
            function (err) {
              console.log("Service Worker registration failed: ", err);
            }
          );
        });
      }
    });
  });

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <NextHead>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src={"/static/wasm_exec.js"} type="text/javascript" />
          <title>My wagmi + RainbowKit App</title>
        </NextHead>
        <ThemeProvider theme={darkTheme}>
          {mounted && (
            <>
              <AppHeader />
              <Component {...pageProps} />
            </>
          )}
        </ThemeProvider>
        <Toaster />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
