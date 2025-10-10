import { useState } from "react";
import { Typography, Alert } from "@mui/material";

import ModalDialog from "../../../components/modal-dialog";
import { useDeleteUser } from "../../../hooks/useUsers";
import type { UserResponse } from "../../../types/users";

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
  user: UserResponse;
}

export function DeleteUserModal({ open, onClose, user }: DeleteUserModalProps) {
  const [error, setError] = useState<string | null>(null);
  const deleteUserMutation = useDeleteUser();

  const handleConfirm = async () => {
    setError(null);

    try {
      await deleteUserMutation.mutateAsync(user.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao excluir usuário. Tente novamente."
      );
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  return (
    <ModalDialog
      open={open}
      onClose={handleCancel}
      title="Confirmar Exclusão"
      showCancelButton
      showConfirmButton
      cancelText="Cancelar"
      confirmText="Excluir"
      confirmColor="error"
      confirmVariant="contained"
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      confirmDisabled={deleteUserMutation.isPending}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography>
        Tem certeza que deseja excluir o usuário <strong>{user.name}</strong>?
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Esta ação não pode ser desfeita.
      </Typography>
    </ModalDialog>
  );
}
