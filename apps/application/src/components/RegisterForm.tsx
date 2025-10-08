import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Alert, Box, Link as MuiLink } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth";
import { useRegister } from "../hooks/useAuth";
import type { RegisterFormData, RegisterRequest } from "../types/auth";

export function RegisterForm() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tenantId: "",
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      await registerMutation.mutateAsync(registerData as RegisterRequest);
      navigate("/dashboard");
    } catch (error: unknown) {
      // Tratar erros específicos da API
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { message: string } } };
        setError("root", { message: axiosError.response.data.message });
      } else {
        setError("root", { message: "Erro ao criar conta. Tente novamente." });
      }
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
            required
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
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            label="Nome"
            type="text"
            autoComplete="name"
            error={!!errors.name}
            helperText={errors.name?.message}
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
            required
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
            required
            fullWidth
            label="Senha"
            type="password"
            autoComplete="new-password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            label="Confirmar Senha"
            type="password"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        )}
      />

      {(errors.root || registerMutation.isError) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.root?.message || "Erro ao criar conta. Tente novamente."}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting || registerMutation.isPending}
        size="large"
      >
        {isSubmitting || registerMutation.isPending ? "Criando conta..." : "Criar conta"}
      </Button>

      <Box sx={{ textAlign: "center" }}>
        <MuiLink component={Link} to="/auth/login" variant="body2">
          Já tem uma conta? Faça login
        </MuiLink>
      </Box>
    </Box>
  );
}