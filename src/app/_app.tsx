import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";

import { chains, client } from "../wagmi";

import AppHeader from "../components/AppHeader";
import "../styles/cat.scss";
import "../styles/global.css";
import Script from "next/script";

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // @ts-ignore
    const go = new window["Go"]();
    window.WebAssembly.instantiateStreaming(
      fetch("/static/json.wasm", {
        headers: {
          "Content-Type": "application/wasm",
        },
      }),
      go.importObject
    ).then((result) => {
      go.run(result.instance);
    });
  });

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <NextHead>
          <title>My wagmi + RainbowKit App</title>
          {/* Need wasm-exec.js run  */}
          <Script src={"/static/wasm_exec.js"} type="text/javascript" />
        </NextHead>
        {mounted && (
          <>
            <AppHeader />
            <Component {...pageProps} />
          </>
        )}
        <Toaster />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
