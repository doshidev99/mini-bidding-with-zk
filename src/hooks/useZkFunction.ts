import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useStoreData } from "../store/useStoreData";

export const useCheckServer = () => {
  let isServer = typeof window === "undefined" ? false : true;
  return isServer;
};

export const useZkFunction = () => {
  const { updateHasBidding } = useStoreData();
  const { updateSessionList } = useStoreData();

  const onCheckInitialized = async () => {
    const result = await window.isInitialized();
    updateHasBidding(result);
    return result;
  };

  const onInitBidding = async () => {
    try {
      const result = await window.initBidding();
      updateHasBidding(true);
      const currentSession = await onGetCurrentSession();
      if (currentSession.roomID > 0) {
        onCreateSession({
          username: "test",
          roomID: 321,
          privateCode: "111",
        });
      }

      return result;
    } catch (e) {
      console.log(e);
    }
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
    console.log({ onCreateSession: result });

    toast.success("Create session successfully");
    await onGetCurrentSession();
    return result;
  };

  const onJoinRoom = async (roomID: number) => {
    const result = await window.joinRoom(roomID);
    toast.success("Join room successfully");
    return result;
  };

  const onGetCurrentSession = async () => {
    const result = await window.getCurrentSession();
    console.log(JSON.parse(result));

    updateSessionList(JSON.parse(result));
    return JSON.parse(result);
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

export const useGetCurrentSession = () => {
  const [loading, setLoading] = useState(false);
  const { hasBidding, updateSessionList } = useStoreData();
  const getCurrentSession = useCallback(async () => {
    setLoading(true);
    try {
      let result = await window.getCurrentSession();
      result = JSON.parse(result);
      updateSessionList(result);
      return result;
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [updateSessionList]);

  useEffect(() => {
    if (hasBidding) {
      getCurrentSession();
    }
  }, [getCurrentSession, hasBidding]);

  return {
    loading,
  };
};
