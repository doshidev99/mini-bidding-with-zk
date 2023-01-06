import { ContractReceipt } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAccount, useSigner } from "wagmi";
import { useStorageData } from "../store/useStorageData";
import { useToggle } from "./../hooks/useToggle";
import { useContractZkBid } from "./useContract";
import { useGetDataPlayer } from "./useGetListPlayer";

export const useBidAction = () => {
  const { data: signerData } = useSigner();
  const zkBidInstance = useContractZkBid(signerData);
  const { address } = useAccount();
  const storageData = useStorageData();
  const getDataList = useGetDataPlayer();

  const getOwner = async () => {
    const owner = await zkBidInstance?.owner();
    storageData.updateOwner(owner);
    return owner;
  };

  const getVerifier = async () => {
    const verifier = await zkBidInstance?.verifier();
    storageData.updateVerifier(verifier);
    return verifier;
  };

  const hasBidding = async (address: string) => {
    const biddingHash = await zkBidInstance?.bidHashes(address);
    console.log(biddingHash, "biddingHash");
    storageData.updateBidHashes(+biddingHash);
    return biddingHash;
  };

  const checkBiddingOpen = async () => {
    const biddingOpen = await zkBidInstance?.biddingOpen();
    storageData.updateStatusBidding(biddingOpen);
    return biddingOpen;
  };

  const checkBiddingEnd = async () => {
    const biddingEnd = await zkBidInstance?.biddingEnd();
    storageData.updateBiddingEnd(biddingEnd);
    return biddingEnd;
  };

  const onStartBidding = async () => {
    try {
      const tx = await zkBidInstance?.startBidding();
      toast.promise(tx.wait(), {
        loading: "Loading",
        success: "Got the data",
        error: "Error when fetching",
      });

      return tx.wait().then((receipt: ContractReceipt) => {
        if (receipt) {
          checkBiddingOpen();
          getDataList();
        }
      });
    } catch (e: any) {
      toast.error(e?.reason || e?.message || e?.data?.message || e?.data);
    }
  };

  const onEndBidding = async () => {
    try {
      const tx = await zkBidInstance?.endBidding();
      toast.promise(tx.wait(), {
        loading: "Loading",
        success: "Got the data",
        error: "Error when fetching",
      });

      return tx.wait().then((receipt: ContractReceipt) => {
        if (receipt) {
          checkBiddingOpen();
          getDataList();
        }
      });
    } catch (e: any) {
      toast.error(e?.reason || e?.message || e?.data?.message || e?.data);
    }
  };

  const onBid = async (
    dataBid: {
      proofBid: string;
      hash: string;
    },
    callback?: () => void
  ) => {
    try {
      const tx = await zkBidInstance?.bid(dataBid.proofBid, dataBid.hash);
      toast.promise(
        tx
          .wait()
          .then((receipt: ContractReceipt) => {
            if (receipt && address) {
              hasBidding(address);
              getDataList();
            }
          })
          .finally(() => callback && callback()),
        {
          loading: "Loading",
          success: "Got the data",
          error: "Error when fetching",
        }
      );
    } catch (e: any) {
      toast.error(e?.reason || e?.message || e?.data?.message || e?.data);
    }
  };

  const onRevealBid = async (
    dataBid: {
      proofBid: string;
      amount: number;
    },
    callback?: () => void
  ) => {
    try {
      const tx = await zkBidInstance?.revealBid(
        dataBid.proofBid,
        dataBid.amount
      );
      toast.promise(
        tx
          .wait()
          .then((receipt: ContractReceipt) => {
            if (receipt && address) {
              hasBidding(address);
              getDataList();
            }
          })
          .finally(() => callback && callback()),
        {
          loading: "Loading",
          success: "Got the data",
          error: "Error when fetching",
        }
      );
    } catch (e: any) {
      toast.error(e?.reason || e?.message || e?.data?.message || e?.data);
    }
  };

  return {
    onBid,
    onRevealBid,
    getOwner,
    getVerifier,
    hasBidding,
    checkBiddingOpen,
    checkBiddingEnd,
    onStartBidding,
    onEndBidding,
  };
};

export const usePreCheck = () => {
  const { getOwner, getVerifier, checkBiddingOpen, checkBiddingEnd } =
    useBidAction();
  const [loading, setLoading] = useToggle(false);
  useEffect(() => {
    setLoading();
    Promise.all([
      getOwner(),
      getVerifier(),
      checkBiddingOpen(),
      checkBiddingEnd(),
    ]).then(() => {
      setLoading();
    });
  }, []);

  return {
    loading,
  };
};

export const useCheckHasBidding = () => {
  const { hasBidding: onCheckBidding } = useBidAction();

  const [loading, setLoading] = useToggle(false);
  const { isConnected, address } = useAccount();
  const [hasBidding, setHasBidding] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      setLoading();
      Promise.all([onCheckBidding(address)]).then((data) => {
        const [hasBidding] = data;
        setHasBidding(+hasBidding > 0);
        setLoading();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return {
    hasBidding,
    loading,
  };
};
