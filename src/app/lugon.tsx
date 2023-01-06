import { ConnectButton } from "@rainbow-me/rainbowkit";
import * as React from "react"
import { useEffect } from "react"

function Page() {
    useEffect(() => {
      // @ts-ignore
        const xxx= window["generateProof"]()
        console.log({xxx})
    })
    return (
        <>
            <ConnectButton/>

        </>
    );
}

export default Page;
