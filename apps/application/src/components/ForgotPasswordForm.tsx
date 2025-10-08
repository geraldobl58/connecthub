import { TextField, Button, Alert, Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../schemas/auth";
import { useForgotPassword } from "../hooks/useAuth";
import type { ForgotPasswordRequest } from "../types/auth";

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordRequest) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
    } catch (error: unknown) {
      // Tratar erros específicos da API
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { message: string } } };
        setError("root", { message: axiosError.response.data.message });
      } else {
        setError("root", { message: "Erro ao enviar email de recuperação. Tente novamente." });
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Recuperar Senha
      </Typography>
      
      <Typography variant="body1" color="text.secondary" textAlign="center" mb={3}>
        Digite seu email para receber as instruções de recuperação de senha
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        {forgotPasswordMutation.isSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.
          </Alert>
        )}

        {(errors.root || forgotPasswordMutation.isError) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.root?.message || "Erro ao enviar email de recuperação. Tente novamente."}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isSubmitting || forgotPasswordMutation.isPending}
          size="large"
        >
          {isSubmitting || forgotPasswordMutation.isPending ? "Enviando..." : "Enviar Email"}
        </Button>
      </Box>
    </Box>
  );
}