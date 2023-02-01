import { zkApi } from "@api/zkApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { keyBy } from "lodash-es";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export const useRoomService = (id?: number) => {
  const queryKey = "room-service";

  const { refetch, data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const data = await zkApi.getRoom();
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

  const queryKey = "room-detail";

  const { refetch, data, isLoading } = useQuery({
    queryKey: [queryKey, query?.id, ...[dependencies || []]],
    queryFn: async () => {
      if (!query?.id)
        return {
          userBiddingInRoom: null,
          roomDetail: null,
          keyByUserBidding: [],
        };
      const roomId = query.id;
      const data = await Promise.all([
        zkApi.getBiddingUserInRoom(roomId),
        zkApi.getRoomById(roomId),
      ]).then(([userBiddingInRoom, roomDetail]) => {
        return {
          userBiddingInRoom,
          roomDetail,
          keyByUserBidding: Object.keys(keyBy(userBiddingInRoom, "user")),
        };
      });
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 10000,
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
