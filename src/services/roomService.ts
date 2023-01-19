import { zkApi } from "@api/zkApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useRoomService = (time?: number) => {
  const queryClient = useQueryClient();
  const queryKey = "room-service";

  const { refetch, data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const data = await zkApi.getRoom();
      return data.sort();
    },
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  // const create = useMutation({
  //   mutationKey: [queryKey + "create"],
  //   mutationFn: async () => {
  //     return await accountApi.generateAccountWallet()
  //   },
  //   onSuccess: () => {
  //     toast.success("Account created")
  //     refetch()
  //   },
  //   onError: (error: any) => {
  //     toast.error(error?.message || "Error")
  //   },
  // })

  return {
    refetch,
    data,
    isLoading,
  };
};
