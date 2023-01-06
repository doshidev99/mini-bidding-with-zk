import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useContract, useProvider, useSigner } from "wagmi";
import { ZK_BID } from "./constants";
import ZKAbi from "./contracts/abi/ZkBid.json";

export const useContractZkBid = (_provider?: any) => {
  const provider = useProvider();
  const { data } = useSigner();
  const router = useRouter();

  let address;

  // if (router.pathname == "/test") {
  //   address =
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     "contract" in router.query &&
  //     ethers.utils.isAddress(router.query.contract as string)
  //       ? (router.query.contract as string)
  //       : ZK_BID;
  // }

  const contractInstance = useContract({
    address: ZK_BID,
    abi: ZKAbi,
    signerOrProvider: _provider || data || provider,
  });

  return contractInstance;
};
