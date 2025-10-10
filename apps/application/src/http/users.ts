import api from "../config/api";
import type {
  UserResponse,
  PaginatedUsersResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserQueryParams,
} from "../types/users";

// Users Service
export const usersService = {
  // Listar usuários com filtros e paginação
  async getUsers(params?: UserQueryParams): Promise<PaginatedUsersResponse> {
    const response = await api.get<PaginatedUsersResponse>("/users", {
      params,
    });
    return response.data;
  },

  // Buscar usuário por ID
  async getUserById(id: string): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  // Criar novo usuário
  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    const response = await api.post<UserResponse>("/users", data);
    return response.data;
  },

  // Atualizar usuário
  async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
    const response = await api.patch<UserResponse>(`/users/${id}`, data);
    return response.data;
  },

  // Excluir usuário (soft delete)
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  // Buscar perfil do usuário atual
  async getCurrentUser(): Promise<UserResponse> {
    const response = await api.get<UserResponse>("/users/me");
    return response.data;
  },

  // Atualizar perfil do usuário atual
  async updateProfile(data: UpdateUserRequest): Promise<UserResponse> {
    const response = await api.patch<UserResponse>("/users/me", data);
    return response.data;
  },

  // Trocar senha
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await api.post("/users/me/change-password", data);
  },

  // Ativar/Desativar usuário
  async toggleUserStatus(id: string, isActive: boolean): Promise<UserResponse> {
    const response = await api.patch<UserResponse>(`/users/${id}`, {
      isActive,
    });
    return response.data;
  },
};

export default usersService;
