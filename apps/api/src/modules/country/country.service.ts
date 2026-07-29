import { countryRepository } from "./country.repository";

export const countryService = {
  async getAll() {
    return countryRepository.getAll();
  },
};
