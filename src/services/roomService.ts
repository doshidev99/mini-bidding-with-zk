import { zkApi } from "@api/zkApi";
import { useStoreDataInRoom } from "@store/useStoreDataInRoom";
import { useStoreDataRoom } from "@store/useStoreDataRoom";
import { useStoreProfile } from "@store/useStoreProfile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LocalStorage } from "@utils/newLocalstorage";
import { keyBy } from "lodash-es";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export const useRoomService = (id?: number) => {
  const queryKey = "room-service";
  const { profile } = useStoreProfile();
  const { updateRoomList } = useStoreDataRoom();

  const { refetch, data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      let data = await zkApi.getRoom();
      // const _roomHasInvites = LocalStorage.get("dataGuestSave");
      // if (_roomHasInvites) {
      //   const dataKeyBy = keyBy(data, "id");
      //   console.log("dataKeyBy", dataKeyBy);
      //   const myRoomInvite = _roomHasInvites[profile.auth_user];
      //   const _rooms = values(myRoomInvite).map((room) => room.infoRoom);
      //   const newDataRoom = {
      //     ...dataKeyBy,
      //     ...keyBy(_rooms, "id"),
      //   };
      //   data = values(newDataRoom);
      // }

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
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error");
    },
  });

  // const { data: currentRoom } = useQuery({
  //   queryKey: [queryKey + "getRoomById"],
  //   queryFn: async () => {
  //     const data = await zkApi.getRoomById(id);
  //     return data;
  //   },
  //   refetchOnWindowFocus: false,
  //   staleTime: 10000,
  // });

  return {
    create,
    refetch,
    data,
    isLoading,
  };
};

export const useDetailInRoom = (dependencies?: any[]) => {
  const { query } = useRouter();
  const { profile } = useStoreProfile();
  const { updateIsLoadingInRoom, updateDetailInRoom, updateIsOwner } =
    useStoreDataInRoom();
  const queryKey = "room-detail";

  const { refetch, data, isLoading } = useQuery({
    queryKey: [queryKey, profile, query?.id, ...[dependencies || []]],
    queryFn: async () => {
      if (!profile) return;
      updateIsLoadingInRoom(false);
      if (!query?.id)
        return {
          userBiddingInRoom: null,
          roomDetail: null,
          keyByUserBidding: [],
        };
      const roomId = query.id;

      const _dataViewRoom = await zkApi.getViewRoomById(roomId);
      const isOwner = _dataViewRoom.creator == profile.auth_user;

      updateIsOwner(isOwner);
      if (!isOwner) {
        updateDetailInRoom(_dataViewRoom);
        return {
          userBiddingInRoom: null,
          roomDetail: null,
          keyByUserBidding: [],
        };
      }

      const data = await Promise.all([
        zkApi.getBiddingUserInRoom(roomId),
        zkApi.getRoomById(roomId),
      ]).then(([userBiddingInRoom, roomDetail]) => {
        console.log("roomDetail", roomDetail);

        updateDetailInRoom(roomDetail);
        // const _data = {
        //   userBiddingInRoom,
        //   roomDetail,
        //   keyByUserBidding: Object.keys(keyBy(userBiddingInRoom, "user")),
        // };
        // updateDetailInRoom(_data);
        // updateIsLoadingInRoom(true);
        // return {
        //   userBiddingInRoom,
        //   roomDetail,
        //   keyByUserBidding: Object.keys(keyBy(userBiddingInRoom, "user")),
        // };
        return [];
      });

      updateIsLoadingInRoom(false);
      return data;
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

// export const useDetailInRoom2 = (dependencies?: any[]) => {
//   const { query } = useRouter();
//   const { updateIsLoadingInRoom, updateDetailInRoom } = useStoreDataInRoom();
//   const queryKey = "room-detail";

//   const { refetch, data, isLoading } = useQuery({
//     queryKey: [queryKey, query?.id, ...[dependencies || []]],
//     queryFn: async () => {
//       updateIsLoadingInRoom(false);
//       if (!query?.id)
//         return {
//           userBiddingInRoom: null,
//           roomDetail: null,
//           keyByUserBidding: [],
//         };
//       const roomId = query.id;
//       const data = await Promise.all([
//         zkApi.getBiddingUserInRoom(roomId),
//         zkApi.getRoomById(roomId),
//       ]).then(([userBiddingInRoom, roomDetail]) => {
//         const _data = {
//           userBiddingInRoom,
//           roomDetail,
//           keyByUserBidding: Object.keys(keyBy(userBiddingInRoom, "user")),
//         };
//         updateDetailInRoom(_data);
//         updateIsLoadingInRoom(true);
//         return {
//           userBiddingInRoom,
//           roomDetail,
//           keyByUserBidding: Object.keys(keyBy(userBiddingInRoom, "user")),
//         };
//       });

//       updateIsLoadingInRoom(false);
//       return data;
//     },
//     refetchOnWindowFocus: true,
//     staleTime: 10000,
//   });

//   return {
//     data,
//     isLoading,
//     refetch,
//   };
// };

export const useGetRoomByGuest = () => {
  const queryKey = "get-room-has-invite-service";
  const { profile } = useStoreProfile();
  const { query } = useRouter();
  const { refetch, data, isLoading } = useQuery({
    queryKey: [queryKey, profile],
    queryFn: async () => {
      const dataGuestSave = LocalStorage.get("dataGuestSave");
      if (!dataGuestSave || !profile) return null;
      const myDataRoom =
        dataGuestSave[profile?.auth_user]?.[query?.id as string];

      const data = await zkApi.viewRoom({
        room_id: +query.id,
        inputs: myDataRoom?.proofId.inputs,
        proof: myDataRoom?.proofId.proof,
      });

      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 10000,
  });

  return {
    refetch,
    data,
    isLoading,
  };
};
