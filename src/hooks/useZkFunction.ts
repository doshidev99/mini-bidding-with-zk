import { useCallback, useEffect, useState } from "react";

export const useCheckServer = () => {
  let isServer = typeof window === "undefined" ? false : true;
  return isServer;
};

export const useZkFunction = () => {
  const onCheckInitialized = async () => {
    const result = await window.isInitialized();
    console.log("checkInitialized", result);
    return result;
  };

  const onInitBidding = () => {
    const result = window.initBidding();
    return result;
  };

  const onCreateSession = async (payload: {
    username: string;
    roomID: number;
    privateCode: string;
  }) => {
    const result = await window.createSession(
      payload.username,
      payload.roomID,
      payload.privateCode
    );
    return result;
  };

  const onJoinRoom = async (roomID: number) => {
    const result = await window.joinRoom(roomID);
    return result;
  };

  const onGetCurrentSession = async () => {
    const result = await window.getCurrentSession();
    return result;
  };

  return {
    onCheckInitialized,
    onInitBidding,
    onCreateSession,
    onJoinRoom,
    onGetCurrentSession,
  };
};

export const useCheckHasBidding = () => {
  const [hasBidding, setHasBidding] = useState(false);
  const isServer = useCheckServer();
  const { onCheckInitialized } = useZkFunction();

  const checkHasBidding = useCallback(async () => {
    const result = await onCheckInitialized();
    setHasBidding(result);
  }, [onCheckInitialized]);

  useEffect(() => {
    if (isServer) return;
    checkHasBidding();
  }, [checkHasBidding, isServer]);

  return {
    hasBidding,
    checkHasBidding,
  };
};
