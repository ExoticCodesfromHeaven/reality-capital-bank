import { api } from "@/lib/axios";

export const countryApi = {
  getCountries: () => api.get("/countries"),
};
