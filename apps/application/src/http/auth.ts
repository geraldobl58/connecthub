import api from "../config/api";
import type { 
  AuthRequest, 
  AuthResponse,
  User,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest
} from "../types/auth";

// Serviços de autenticação
export const authService = {
  // Login
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  // Registro
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  // Recuperar senha
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  },

  // Redefinir senha
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  // Buscar perfil do usuário
  async getProfile(): Promise<User> {
    const response = await api.get<User>("/auth/profile");
    return response.data;
  },

  // Atualizar perfil
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await api.put<User>("/auth/profile", data);
    return response.data;
  },

  // Refresh token
  async refreshToken(): Promise<{ access_token: string }> {
    const response = await api.post("/auth/refresh");
    return response.data;
  },

  // Verificar se o token é válido
  async verifyToken(): Promise<boolean> {
    try {
      await api.get("/auth/verify");
      return true;
    } catch {
      return false;
    }
  },
};

// Função helper para configurar o token no axios
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Função helper para obter token do localStorage
export const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Função helper para salvar token no localStorage
export const setStoredToken = (token: string) => {
  localStorage.setItem('auth_token', token);
  setAuthToken(token);
};

// Função helper para remover token do localStorage
export const removeStoredToken = () => {
  localStorage.removeItem('auth_token');
  setAuthToken(null);
};

// Interceptador para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptador para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { access_token } = await authService.refreshToken();
        setStoredToken(access_token);
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        removeStoredToken();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Função legacy para compatibilidade
export const authenticate = authService.login;
