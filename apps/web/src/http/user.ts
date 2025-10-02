import api from "@/lib/api";
import {
  UserPaginatedResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserListParams,
  CreateUserResponse,
  UpdateUserResponse,
} from "@/types/users";

export const userHttpService = {
  /**
   * Listagem de Usuários com paginação e filtros
   */
  async getUsers(params?: UserListParams): Promise<UserPaginatedResponse> {
    // Criar parâmetros limpos para evitar problemas de serialização
    const cleanParams: Record<string, string> = {};

    if (params?.search) {
      cleanParams.search = params.search;
    }
    if (params?.role) {
      cleanParams.role = params.role;
    }
    if (params?.isActive !== undefined) {
      cleanParams.isActive = params.isActive.toString();
    }
    if (params?.page) {
      cleanParams.page = params.page.toString();
    }
    if (params?.limit) {
      cleanParams.limit = params.limit.toString();
    }

    const response = await api.get("/users", { params: cleanParams });
    return response.data;
  },

  /**
   * Buscar usuário por ID
   */
  async getUserById(id: string): Promise<UserResponse> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Criar novo usuário
   */
  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await api.post("/users", userData);
    return response.data;
  },

  /**
   * Atualizar usuário
   */
  async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Deletar usuário
   */
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  /**
   * Ativar/Desativar usuário
   */
  async toggleUserStatus(
    id: string,
    isActive: boolean
  ): Promise<UpdateUserResponse> {
    const response = await api.patch(`/users/${id}/status`, { isActive });
    return response.data;
  },
};
