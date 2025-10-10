import { DataGrid } from "@mui/x-data-grid";

import { Paper } from "@mui/material";

import type { columns } from "../pages/users/components/columns";

interface DataTableProps {
  rows: typeof rows;
  columns: typeof columns;
  initialState: { pagination: { paginationModel: typeof paginationModel } };
  pageSizeOptions: number[];
  checkboxSelection: boolean;
  sx: object;
}

export default function DataTable({
  rows,
  columns,
  initialState,
  pageSizeOptions,
  checkboxSelection,
  sx,
}: DataTableProps) {
  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={initialState}
        pageSizeOptions={pageSizeOptions}
        checkboxSelection={checkboxSelection}
        sx={sx}
      />
    </Paper>
  );
}
