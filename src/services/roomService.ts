import { zkApi } from "@api/zkApi";
import { useStoreDataInRoom } from "@store/useStoreDataInRoom";
import { useStoreDataRoom } from "@store/useStoreDataRoom";
import { useStoreProfile } from "@store/useStoreProfile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LocalStorage } from "@utils/newLocalstorage";
import { keyBy, keys } from "lodash-es";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export const useRoomService = (id?: number) => {
  const queryKey = "room-service";
  const { updateRoomList } = useStoreDataRoom();
  const { refetch: fetchMyRoom } = useRoomMyService();
  const { refetch, data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      let data = await zkApi.getRoom();
      updateRoomList(data);
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 10000,
  });

  const create = useMutation({
    mutationKey: [queryKey + "create"],
    mutationFn: async (payload) => {
      const data = await zkApi.createRoom(payload);
      return data;
    },
    onSuccess: (_data) => {
      toast.success(`Create room ${_data.id} successfully`);
      refetch();
      fetchMyRoom();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error");
    },
  });

  return {
    create,
    refetch,
    data,
    isLoading,
  };
};

export const useRoomMyService = (id?: number) => {
  const queryKey = "my-room-service";
  const { updateMyRoom } = useStoreDataRoom();

  const { refetch, data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      let data = await zkApi.getMyRoom();
      updateMyRoom(data);
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 10000,
  });

  const create = useMutation({
    mutationKey: [queryKey + "create"],
    mutationFn: async (payload) => {
      const data = await zkApi.createRoom(payload);
      return data;
    },
    onSuccess: (_data) => {
      toast.success(`Create room ${_data.id} successfully`);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error");
    },
  });

  return {
    create,
    refetch,
    data,
    isLoading,
  };
};

export const useDetailInRoom = () => {
  const { query } = useRouter();
  const { profile } = useStoreProfile();
  const { updateIsLoadingInRoom, updateDetailInRoom, updateIsOwner } =
    useStoreDataInRoom();
  const queryKey = "room-useDetailInRoom";

  const { refetch, data, isLoading } = useQuery({
    queryKey: [queryKey, profile, query?.id],
    queryFn: async () => {
      if (!profile || !query?.id) return 1;
      updateIsLoadingInRoom(false);
      const roomId = query.id;

      const _dataViewRoom = await zkApi.getViewRoomById(+roomId);
      console.log("profile", profile);

      const isOwner = _dataViewRoom.creator == profile.id;
      updateIsOwner(isOwner);
      if (!isOwner) {
        const proofStorage = LocalStorage.get("proofInRoom");
        if (proofStorage && proofStorage[profile.id + roomId]) {
          const proofInRoom = proofStorage?.[profile.id + roomId];
          const _dataRoomByProof = await zkApi.viewRoomWithProof({
            room_id: +roomId,
            inputs: proofInRoom.proofId.inputs,
            proof: proofInRoom.proofId.proof,
          });
          updateDetailInRoom(_dataRoomByProof);
          const myBid = await zkApi.getBiddingUserInRoom(roomId);
          if (myBid) {
            const keyByMyBid = keyBy(myBid, "room_id");
            const isBided = keys(keyByMyBid).includes(roomId + "");
            _dataRoomByProof.isBided = isBided;
            updateDetailInRoom({ ..._dataRoomByProof });
          }
        } else {
          updateDetailInRoom(_dataViewRoom);
        }
        return 1;
      }
      const roomCreator = await zkApi.getRoomById(roomId);
      updateDetailInRoom(roomCreator);

      updateIsLoadingInRoom(false);
      return 1;
    },
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
