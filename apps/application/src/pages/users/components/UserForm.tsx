import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Stack,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

import { createUserSchema, updateUserSchema } from "../../../schemas/user";
import type { CreateUserData, UpdateUserData } from "../../../schemas/user";
import { UserRole } from "../../../types/users";
import type { UserResponse } from "../../../types/users";

interface UserFormProps {
  user?: UserResponse;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  isLoading?: boolean;
  error?: string | null;
  mode: "create" | "edit";
}

const CreateUserForm = ({
  onSubmit,
  isLoading,
  error,
}: Pick<UserFormProps, "onSubmit" | "isLoading" | "error">) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: UserRole.VIEWER,
      isActive: true,
    },
    mode: "onChange",
  });

  return (
    <Box component="form" id="user-form" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nome completo"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isLoading}
              required
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              required
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Senha"
              type={showPassword ? "text" : "password"}
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Confirmar senha"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={isLoading}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Perfil</InputLabel>
              <Select {...field} label="Perfil" disabled={isLoading}>
                <MenuItem value={UserRole.VIEWER}>Visualizador</MenuItem>
                <MenuItem value={UserRole.AGENT}>Agente</MenuItem>
                <MenuItem value={UserRole.MANAGER}>Gerente</MenuItem>
                <MenuItem value={UserRole.ADMIN}>Administrador</MenuItem>
              </Select>
              {errors.role && (
                <Box sx={{ mt: 0.5, fontSize: "0.75rem", color: "error.main" }}>
                  {errors.role.message}
                </Box>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Usuário ativo"
            />
          )}
        />
      </Stack>
    </Box>
  );
};

const EditUserForm = ({
  user,
  onSubmit,
  isLoading,
  error,
}: Pick<UserFormProps, "user" | "onSubmit" | "isLoading" | "error">) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || UserRole.VIEWER,
      isActive: user?.isActive ?? true,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user, reset]);

  return (
    <Box component="form" id="user-form" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nome completo"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isLoading}
              required
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              required
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Perfil</InputLabel>
              <Select {...field} label="Perfil" disabled={isLoading}>
                <MenuItem value={UserRole.VIEWER}>Visualizador</MenuItem>
                <MenuItem value={UserRole.AGENT}>Agente</MenuItem>
                <MenuItem value={UserRole.MANAGER}>Gerente</MenuItem>
                <MenuItem value={UserRole.ADMIN}>Administrador</MenuItem>
              </Select>
              {errors.role && (
                <Box sx={{ mt: 0.5, fontSize: "0.75rem", color: "error.main" }}>
                  {errors.role.message}
                </Box>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Usuário ativo"
            />
          )}
        />
      </Stack>
    </Box>
  );
};

export function UserForm({ mode, ...props }: UserFormProps) {
  if (mode === "create") {
    return <CreateUserForm {...props} />;
  }

  return <EditUserForm {...props} />;
}
