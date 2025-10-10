import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { TextField, Button, Alert, Box, Link as MuiLink } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../../schemas/auth";

import { useAuthContext } from "../../../context/authContext";

import { mapApiToFormError } from "../../../lib/formErrors";

import type { AuthRequest } from "../../../types/auth";

export function LoginForm() {
  const navigate = useNavigate();
  const auth = useAuthContext();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AuthRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      tenantId: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthRequest) => {
    try {
      await auth.login(data);
      navigate("/dashboard");
    } catch (error: unknown) {
      mapApiToFormError(setError, error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Controller
        name="tenantId"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            label="Tenant ID"
            type="text"
            autoComplete="organization"
            autoFocus
            error={!!errors.tenantId}
            helperText={errors.tenantId?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            label="Email"
            type="email"
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            label="Senha"
            type="password"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />

      {errors.root && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.root?.message ||
            "Erro ao fazer login. Verifique suas credenciais."}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
        size="large"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>

      <Box sx={{ textAlign: "center" }}>
        <MuiLink component={Link} to="/auth/register" variant="body2">
          Não tem uma conta? Cadastre-se
        </MuiLink>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          mt: 3,
          p: 2,
          bgcolor: "grey.50",
          borderRadius: 1,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <strong>🧪 Dados para Teste (Seed)</strong>
        </Box>
        <Box
          sx={{
            fontSize: "0.875rem",
            color: "text.secondary",
            textAlign: "left",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <strong>🏢 Empresa Demo (Plano STARTER)</strong>
            <Box sx={{ ml: 1, mt: 0.5 }}>
              • <strong>Admin:</strong> empresa-demo | admin@empresa-demo.com
              <br />• <strong>Manager:</strong> empresa-demo |
              manager@empresa-demo.com
              <br />• <strong>Agent:</strong> empresa-demo |
              agent@empresa-demo.com
              <br />• <strong>Viewer:</strong> empresa-demo |
              viewer@empresa-demo.com
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <strong>🏠 Imobiliária ABC (Plano PROFESSIONAL)</strong>
            <Box sx={{ ml: 1, mt: 0.5 }}>
              • <strong>Admin:</strong> imobiliaria-abc |
              admin@imobiliaria-abc.com
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <strong>💻 Tech Solutions (Plano ENTERPRISE)</strong>
            <Box sx={{ ml: 1, mt: 0.5 }}>
              • <strong>Admin:</strong> tech-solutions |
              admin@tech-solutions.com
            </Box>
          </Box>
          <Box
            sx={{
              textAlign: "center",
              mt: 2,
              p: 1,
              bgcolor: "primary.light",
              color: "white",
              borderRadius: 1,
            }}
          >
            <strong>🔑 Senha para todos os usuários: Demo123!</strong>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
