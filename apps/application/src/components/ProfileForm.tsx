import { TextField, Button, Alert, Box, Typography, Avatar } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "../schemas/auth";
import { useUpdateProfile, useAuth } from "../hooks/useAuth";
import type { UpdateProfileRequest } from "../types/auth";

export function ProfileForm() {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setError,
    reset,
  } = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: UpdateProfileRequest) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      reset(data); // Reset form with new values to clear isDirty
    } catch (error: unknown) {
      // Tratar erros específicos da API
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { message: string } } };
        setError("root", { message: axiosError.response.data.message });
      } else {
        setError("root", { message: "Erro ao atualizar perfil. Tente novamente." });
      }
    }
  };

  if (!user) {
    return (
      <Alert severity="warning">
        Carregando dados do usuário...
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar sx={{ width: 80, height: 80, mr: 2 }}>
          {user.name?.charAt(0).toUpperCase() || "U"}
        </Avatar>
        <Box>
          <Typography variant="h5" component="h1">
            Meu Perfil
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Atualize suas informações pessoais
          </Typography>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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

        {updateProfileMutation.isSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Perfil atualizado com sucesso!
          </Alert>
        )}

        {(errors.root || updateProfileMutation.isError) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.root?.message || "Erro ao atualizar perfil. Tente novamente."}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={!isDirty || isSubmitting || updateProfileMutation.isPending}
          size="large"
        >
          {isSubmitting || updateProfileMutation.isPending ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </Box>
    </Box>
  );
}