import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { Paper, Box, Typography } from "@mui/material";
import type {
  GridInitialState,
  GridSlotsComponent,
  GridRowParams,
  GridRowSelectionModel,
  GridCallbackDetails,
  GridPaginationModel,
} from "@mui/x-data-grid";

interface DataTableProps<T = Record<string, unknown>> {
  // Dados da tabela
  rows: T[];
  columns: GridColDef[];

  // Configurações opcionais
  loading?: boolean;
  error?: string | null;

  // Layout e aparência
  height?: number | string;
  checkboxSelection?: boolean;
  disableRowSelectionOnClick?: boolean;

  // Paginação server-side
  rowCount?: number; // Total de registros no servidor
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  pageSizeOptions?: number[];

  // Estado inicial (apenas para paginação client-side)
  initialState?: GridInitialState;

  // Customização
  sx?: object;
  paperSx?: object;

  // Slots personalizados
  slots?: Partial<GridSlotsComponent>;
  slotProps?: Record<string, unknown>;

  // Callbacks
  onRowClick?: (params: GridRowParams) => void;
  onSelectionChange?: (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails
  ) => void;

  // Título opcional
  title?: string;
  subtitle?: string;

  // Mode de paginação
  paginationMode?: "client" | "server";
}

export default function DataTable<T = Record<string, unknown>>({
  rows,
  columns,
  loading = false,
  error = null,
  height = 400,
  checkboxSelection = false,
  disableRowSelectionOnClick = false,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions = [5, 10, 25, 50],
  initialState = {
    pagination: {
      paginationModel: { pageSize: 10, page: 0 },
    },
  },
  paperSx = {},
  slots,
  slotProps,
  onRowClick,
  onSelectionChange,
  title,
  subtitle,
  paginationMode = "client",
}: DataTableProps<T>) {
  return (
    <Paper sx={{ width: "100%", ...paperSx }}>
      {/* Header opcional */}
      {(title || subtitle) && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          {title && (
            <Typography variant="h6" component="h2" gutterBottom>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Mensagem de erro */}
      {error && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* DataGrid */}
      <Box sx={{ height }}>
        <DataGrid
          autoHeight={typeof height === "number"}
          density="compact"
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={rowCount}
          paginationMode={paginationMode}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          initialState={initialState}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          onRowClick={onRowClick}
          onRowSelectionModelChange={onSelectionChange}
          slots={slots}
          slotProps={slotProps}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          // Configurações importantes para paginação server-side
          keepNonExistentRowsSelected={false}
          disableVirtualization={false}
        />
      </Box>
    </Paper>
  );
}
