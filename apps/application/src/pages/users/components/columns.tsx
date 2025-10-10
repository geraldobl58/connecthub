import type { GridColDef } from "@mui/x-data-grid";
import { Chip, IconButton, Tooltip, Box, Menu, MenuItem } from "@mui/material";
import { Edit, Delete, PersonOff, Person, MoreVert } from "@mui/icons-material";
import { useState } from "react";
import type { UserResponse } from "../../../types/users";

interface ColumnsProps {
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const createColumns = ({
  onEdit,
  onToggleStatus,
  onDelete,
}: ColumnsProps): GridColDef<UserResponse>[] => [
  {
    field: "id",
    headerName: "ID",
    width: 100,
    renderCell: (params) => (
      <Tooltip title={params.value}>
        <span style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>
          {params.value.substring(0, 8)}...
        </span>
      </Tooltip>
    ),
  },
  {
    field: "name",
    headerName: "Nome",
    width: 200,
    flex: 1,
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
    flex: 1,
  },
  {
    field: "role",
    headerName: "Perfil",
    width: 130,
    renderCell: (params) => {
      const roleLabels: Record<string, string> = {
        VIEWER: "Visualizador",
        AGENT: "Agente",
        MANAGER: "Gerente",
        ADMIN: "Administrador",
      };

      const roleColors: Record<
        string,
        | "default"
        | "primary"
        | "secondary"
        | "error"
        | "info"
        | "success"
        | "warning"
      > = {
        VIEWER: "default",
        AGENT: "info",
        MANAGER: "warning",
        ADMIN: "error",
      };

      return (
        <Chip
          label={roleLabels[params.value] || params.value}
          color={roleColors[params.value] || "default"}
          size="small"
        />
      );
    },
  },
  {
    field: "isActive",
    headerName: "Status",
    width: 100,
    renderCell: (params) => (
      <Chip
        label={params.value ? "Ativo" : "Inativo"}
        color={params.value ? "success" : "default"}
        size="small"
      />
    ),
  },
  {
    field: "createdAt",
    headerName: "Criado em",
    width: 130,
    renderCell: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString("pt-BR");
    },
  },
  {
    field: "actions",
    headerName: "Ações",
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
      const open = Boolean(anchorEl);

      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = () => {
        setAnchorEl(null);
      };

      const handleEdit = () => {
        onEdit(params.row.id);
        handleClose();
      };

      const handleToggleStatus = () => {
        onToggleStatus(params.row.id);
        handleClose();
      };

      const handleDelete = () => {
        onDelete(params.row.id);
        handleClose();
      };

      return (
        <Box>
          <IconButton
            size="small"
            onClick={handleClick}
            aria-label="more"
            aria-controls={open ? "user-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleEdit}>
              <Edit fontSize="small" sx={{ mr: 1 }} />
              Editar
            </MenuItem>
            <MenuItem onClick={handleToggleStatus}>
              {params.row.isActive ? (
                <>
                  <PersonOff fontSize="small" sx={{ mr: 1 }} />
                  Desativar
                </>
              ) : (
                <>
                  <Person fontSize="small" sx={{ mr: 1 }} />
                  Ativar
                </>
              )}
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
              <Delete fontSize="small" sx={{ mr: 1 }} />
              Excluir
            </MenuItem>
          </Menu>
        </Box>
      );
    },
  },
];
