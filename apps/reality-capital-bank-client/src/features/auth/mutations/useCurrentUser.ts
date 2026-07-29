import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await authApi.me();
      return res.data.data;
    },
  });
}
