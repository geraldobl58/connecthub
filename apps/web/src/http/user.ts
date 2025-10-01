import api from "@/lib/api";

import { UserPaginatedResponse } from "@/types/users";

export const userHttpService = {
  /**
   * Listagem de Usuários
   */
  async getUsers(): Promise<UserPaginatedResponse> {
    const response = await api.get("/users");
    return response.data;
  },
};
