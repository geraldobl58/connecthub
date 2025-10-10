import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";

import ModalDialog from "../../../components/modal-dialog";
import { UserForm } from "./user-form";
import { useCreateUser, useUpdateUser } from "../../../hooks/useUsers";
import type { CreateUserData, UpdateUserData } from "../../../schemas/user";
import type { UserResponse } from "../../../types/users";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  user?: UserResponse;
  mode: "create" | "edit";
}

export function UserModal({ open, onClose, user, mode }: UserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const handleSubmit = async (data: CreateUserData | UpdateUserData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === "create") {
        await createUserMutation.mutateAsync(data as CreateUserData);
      } else if (user) {
        await updateUserMutation.mutateAsync({
          id: user.id,
          data: data as UpdateUserData,
        });
      }

      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao salvar usuário. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  const title = mode === "create" ? "Novo Usuário" : "Editar Usuário";
  const submitText = mode === "create" ? "Criar Usuário" : "Salvar Alterações";

  return (
    <ModalDialog
      open={open}
      onClose={handleCancel}
      title={title}
      maxWidth="sm"
      fullWidth
      actions={[
        <Button
          key="cancel"
          onClick={handleCancel}
          disabled={isSubmitting}
          variant="outlined"
        >
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="submit"
          form="user-form"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting && <CircularProgress size={16} />}
        >
          {submitText}
        </Button>,
      ]}
    >
      <UserForm
        user={user}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        error={error}
        mode={mode}
      />
    </ModalDialog>
  );
}
