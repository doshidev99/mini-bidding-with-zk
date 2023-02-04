import { zkApi } from "@api/zkApi";
import { useQuery } from "@tanstack/react-query";
import { useStoreProfile } from "./../store/useStoreProfile";

export const useProfileService = () => {
  const queryKey = "get-profile";
  const { updateProfile } = useStoreProfile();

  const { refetch, data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const data = await zkApi.getProfile();
      updateProfile(data);
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
