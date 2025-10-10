import { Typography, Box, Paper, Button } from "@mui/material";

import DataTable from "../../components/data-table";
import { columns } from "./components/columns";

export function UsersPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Usuários
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Gerencie todos os usuários do sistema
      </Typography>

      <Paper sx={{ p: 3, textAlign: "center" }}>
        <DataTable
          rows={[]}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
        <Button variant="outlined" onClick={handleClickOpen}>
          Open dialog
        </Button>
      </Paper>
    </Box>
  );
}
