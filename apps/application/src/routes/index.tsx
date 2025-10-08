import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "../layouts/auth";
import { DashboardLayout } from "../layouts/dashboard";
import { LoginPage } from "../pages/auth/login";
import { RegisterPage } from "../pages/auth/register";
import { DashboardPage } from "../pages/dashboard";
import { PropertiesPage } from "../pages/dashboard/properties";
import { UsersPage } from "../pages/dashboard/users";
import { PlansPage } from "../pages/dashboard/plans";
import { SettingsPage } from "../pages/dashboard/settings";

// Hook para verificar se o usuário está autenticado
function useAuth() {
  const token = localStorage.getItem("auth_token");
  return !!token;
}

// Componente para proteger rotas autenticadas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

// Componente para redirecionar usuários autenticados
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to dashboard if authenticated, otherwise to login */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Auth Routes */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route index element={<Navigate to="login" replace />} />
      </Route>

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="plans" element={<PlansPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
