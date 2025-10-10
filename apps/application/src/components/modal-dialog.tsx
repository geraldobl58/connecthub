import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface ModalDialogProps {
  // Estado do modal
  open: boolean;
  onClose: () => void;

  // Conteúdo
  title?: string;
  children: ReactNode;

  // Configurações
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  fullWidth?: boolean;
  dividers?: boolean;
  disableEscapeKeyDown?: boolean;
  disableBackdropClick?: boolean;

  // Botões da action bar
  actions?: ReactNode;

  // Botões padrão de confirmação/cancelamento
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmDisabled?: boolean;

  // Variantes do botão de confirmação
  confirmVariant?: "text" | "outlined" | "contained";
  confirmColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";

  // Customização visual
  hideCloseButton?: boolean;

  // IDs para acessibilidade
  id?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export default function ModalDialog({
  open,
  onClose,
  title,
  children,
  maxWidth = "sm",
  fullWidth = true,
  dividers = true,
  disableEscapeKeyDown = false,
  disableBackdropClick = false,
  actions,
  showCancelButton = false,
  showConfirmButton = false,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  onCancel,
  onConfirm,
  confirmDisabled = false,
  confirmVariant = "contained",
  confirmColor = "primary",
  hideCloseButton = false,
  id = "modal-dialog",
  "aria-labelledby": ariaLabelledBy = `${id}-title`,
  "aria-describedby": ariaDescribedBy = `${id}-content`,
}: ModalDialogProps) {
  const handleClose = () => {
    if (!disableBackdropClick) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const hasDefaultActions = showCancelButton || showConfirmButton;

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      open={open}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      disableEscapeKeyDown={disableEscapeKeyDown}
    >
      {/* Header com título e botão de fechar */}
      {title && (
        <DialogTitle sx={{ m: 0, p: 2 }} id={ariaLabelledBy}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component="span">
              {title}
            </Typography>
            {!hideCloseButton && (
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={(theme) => ({
                  color: theme.palette.grey[500],
                })}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
      )}

      {/* Botão de fechar quando não há título */}
      {!title && !hideCloseButton && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
            zIndex: 1,
          })}
        >
          <CloseIcon />
        </IconButton>
      )}

      {/* Conteúdo */}
      <DialogContent dividers={dividers} id={ariaDescribedBy}>
        {children}
      </DialogContent>

      {/* Actions personalizadas ou padrão */}
      {(actions || hasDefaultActions) && (
        <DialogActions sx={{ p: 2 }}>
          {actions ? (
            actions
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              {showCancelButton && (
                <Button
                  onClick={handleCancel}
                  variant="outlined"
                  color="inherit"
                >
                  {cancelText}
                </Button>
              )}
              {showConfirmButton && (
                <Button
                  onClick={handleConfirm}
                  variant={confirmVariant}
                  color={confirmColor}
                  disabled={confirmDisabled}
                >
                  {confirmText}
                </Button>
              )}
            </Box>
          )}
        </DialogActions>
      )}
    </BootstrapDialog>
  );
}
