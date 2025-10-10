import {
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
} from "@mui/material";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Add, Search, FilterAlt } from "@mui/icons-material";
import type { GridPaginationModel } from "@mui/x-data-grid";

import DataTable from "../../components/data-table";
import { LoadingBackdrop } from "../../components/loading-backdrop";
import { createColumns } from "./components/columns";
import { UserModal } from "./components/UserModal";
import { DeleteUserModal } from "./components/DeleteUserModal";
import { useUsers, useToggleUserStatus } from "../../hooks/useUsers";
import type { UserQueryParams, UserResponse } from "../../types/users";
import { UserRole } from "../../types/users";

export function UsersPage() {
  // Estados dos modais
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  // Estado local para busca com debounce
  const [searchInput, setSearchInput] = useState("");
  const searchTimeoutRef = useRef<number | undefined>(undefined);

  // Estados simples para filtros (sem URL complexity)
  const [filters, setFilters] = useState<UserQueryParams>({
    page: 1,
    limit: 10,
    search: undefined,
    role: undefined,
    isActive: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Nota: usamos apenas `filters` como fonte da verdade. Não vamos controlar
  // o `DataGrid` com `paginationModel` para evitar ciclos/duplos disparos.
  // Em vez disso, passamos `initialState` e forçamos remount do componente
  // quando os filtros mudam (via `key`) para que o DataGrid reinicie sua
  // paginação interna no valor correto.

  // Funções simples para atualizar filtros
  const updateFilter = useCallback(
    (field: keyof UserQueryParams, value: unknown) => {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
        // Reset página para 1 quando filtrar (exceto ao mudar página ou limit)
        ...(field !== "page" && field !== "limit" && { page: 1 }),
      }));
    },
    []
  );

  const updateFilters = useCallback((updates: Partial<UserQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);
  // Queries e mutations
  const { data, isLoading, error } = useUsers(filters);
  const toggleStatusMutation = useToggleUserStatus();

  // Queries e mutations

  // Sincronizar searchInput com filters.search quando mudar de fora (ex: limpar filtros)
  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  // Cleanup do timeout ao desmontar
  useEffect(() => {
    const timeoutId = searchTimeoutRef.current;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Handlers para modais
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleOpenEditModal = useCallback((user: UserResponse) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  }, []);

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteModal = useCallback((user: UserResponse) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // Handler para alternar status
  const handleToggleStatus = useCallback(
    async (user: UserResponse) => {
      try {
        await toggleStatusMutation.mutateAsync({
          id: user.id,
          isActive: !user.isActive,
        });
      } catch (error) {
        console.error("Erro ao alterar status:", error);
      }
    },
    [toggleStatusMutation]
  );

  // Handler para filtros com debounce no search
  const handleFilterChange = (field: keyof UserQueryParams, value: unknown) => {
    // Para o campo search, aplicar debounce
    if (field === "search") {
      // Atualizar input local imediatamente (UX responsiva)
      setSearchInput(value as string);

      // Limpar timeout anterior
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Aplicar debounce de 500ms antes de atualizar os filtros
      searchTimeoutRef.current = window.setTimeout(() => {
        updateFilters({
          search: (value as string) || undefined,
          page: 1,
        });
      }, 500);
    }
    // Para outros filtros, aplicar imediatamente
    else if (field !== "page" && field !== "limit") {
      updateFilters({
        [field]: value,
        page: 1,
      });
    } else {
      updateFilter(field, value);
    }
  };

  // Handler para paginação do DataGrid
  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      // Atualizar filtros para a query (page é base 1)
      setFilters((prev) => ({
        ...prev,
        page: model.page + 1,
        limit: model.pageSize,
      }));
    },
    []
  );

  // Colunas da tabela com actions
  const columns = useMemo(
    () =>
      createColumns({
        onEdit: (id: string) => {
          const user = data?.data.find((u) => u.id === id);
          if (user) handleOpenEditModal(user);
        },
        onDelete: (id: string) => {
          const user = data?.data.find((u) => u.id === id);
          if (user) handleOpenDeleteModal(user);
        },
        onToggleStatus: (id: string) => {
          const user = data?.data.find((u) => u.id === id);
          if (user) handleToggleStatus(user);
        },
      }),
    [data?.data, handleOpenEditModal, handleOpenDeleteModal, handleToggleStatus]
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabeçalho */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Usuários
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreateModal}
        >
          Novo Usuário
        </Button>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            label="Buscar"
            placeholder="Nome ou email"
            variant="outlined"
            size="small"
            value={searchInput}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Perfil</InputLabel>
            <Select
              value={filters.role || ""}
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange(
                  "role",
                  !value ? undefined : (value as UserRole)
                );
              }}
              label="Perfil"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value={UserRole.VIEWER}>Visualizador</MenuItem>
              <MenuItem value={UserRole.AGENT}>Agente</MenuItem>
              <MenuItem value={UserRole.MANAGER}>Gerente</MenuItem>
              <MenuItem value={UserRole.ADMIN}>Administrador</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={
                filters.isActive === undefined
                  ? ""
                  : filters.isActive.toString()
              }
              onChange={(e) =>
                handleFilterChange(
                  "isActive",
                  e.target.value === "" ? undefined : e.target.value === "true"
                )
              }
              label="Status"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Ativo</MenuItem>
              <MenuItem value="false">Inativo</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            onClick={() => {
              // Limpar input de busca local
              setSearchInput("");
              // Limpar timeout pendente
              if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
              }
              // Limpar filtros
              updateFilters({
                search: undefined,
                role: undefined,
                isActive: undefined,
                page: 1,
              });
            }}
          >
            Limpar Filtros
          </Button>
        </Stack>
      </Paper>

      {/* Mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || "Erro ao carregar usuários"}
        </Alert>
      )}

      {/* Tabela */}
      <DataTable
        key={`users-table-p${filters.page}-l${filters.limit}`}
        columns={columns}
        rows={data?.data || []}
        loading={isLoading}
        error={error?.message}
        paginationMode="server"
        rowCount={data?.meta?.total || 0}
        onPaginationModelChange={handlePaginationModelChange}
        initialState={{
          pagination: {
            paginationModel: {
              page: (filters.page || 1) - 1,
              pageSize: filters.limit || 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
        title="Lista de Usuários"
        subtitle={
          data
            ? `Total de usuários: ${data.meta.total}`
            : "Carregando total de usuários..."
        }
      />

      {/* Loading Global */}
      <LoadingBackdrop open={isLoading} />

      {/* Modais */}
      <UserModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        mode="create"
      />

      <UserModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        user={selectedUser || undefined}
        mode="edit"
      />

      {selectedUser && (
        <DeleteUserModal
          open={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          user={selectedUser}
        />
      )}
    </Box>
  );
}

export default UsersPage;
