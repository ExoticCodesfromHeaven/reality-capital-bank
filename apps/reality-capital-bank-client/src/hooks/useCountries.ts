import { useQuery } from "@tanstack/react-query";
import { countryApi } from "../features/auth/api/country.api";

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data } = await countryApi.getCountries();
      return data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
