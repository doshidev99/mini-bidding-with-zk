import { useRouter } from "next/router";
import { multicall } from "@wagmi/core";
import { useToggle } from "./../hooks/useToggle";
import { useStorageData } from "./../store/useStorageData";

import { useEffect } from "react";
import { useSigner } from "wagmi";
import ZKAbi from "../web3/contracts/abi/ZkBid.json";
import { useContractZkBid } from "./useContract";

export const useGetDataPlayer = () => {
  const { data } = useSigner();
  const contractInstance = useContractZkBid(data);
  const { updateDataList, updateStorageLoad } = useStorageData();

  const get = async () => {
    if (!contractInstance) return [];
    const contractInfo = {
      address: contractInstance.address,
      abi: ZKAbi,
    };
    updateStorageLoad(true);
    try {
      const totalUserBidding = await contractInstance?.totalUsersBidding();
      const contracts = [...new Array(+totalUserBidding).keys()].map((i) => ({
        ...contractInfo,
        functionName: "getUserByIndex",
        args: [+i],
      }));

      const _dataUserByIndex = await multicall({
        contracts: contracts,
      });

      const _dataUser = await Promise.all([
        multicall({
          contracts: _dataUserByIndex.map((user) => ({
            ...contractInfo,
            functionName: "bidHashes",
            args: [user],
          })),
        }),
        multicall({
          contracts: _dataUserByIndex.map((user) => ({
            ...contractInfo,
            functionName: "bidValues",
            args: [user],
          })),
        }),
      ]);

      const _data = [...new Array(+totalUserBidding).keys()].map((i) => {
        return {
          key: i + 1,
          address: _dataUserByIndex[i],
          bidHash: _dataUser[0][i],
          bidValue: _dataUser[1][i],
          tags: [Number(_dataUser[1][i]) > 0 ? "Ready" : "Not Ready"],
        };
      });
      updateDataList(_data as any);
      updateStorageLoad(false);
      return _data;
    } catch (er: any) {
      console.log(er?.reason);
    }
  };

  return get;
};

export const useGetPlayers = () => {
  const { isReady } = useRouter();
  const { data } = useSigner();

  const contractInstance = useContractZkBid(data);
  const [loading, setLoading] = useToggle(false);
  const { updateTotalRevealed } = useStorageData();

  const getTotalRevealed = async () => {
    if (!contractInstance) return 0;
    const total = await contractInstance?.revealed();
    updateTotalRevealed(+total);
    return total;
  };

  const get = useGetDataPlayer();
  useEffect(() => {
    if (isReady && contractInstance) {
      setLoading();
      Promise.all([get(), getTotalRevealed()]).finally(setLoading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading };
};
