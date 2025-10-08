import { Typography, Box, Paper } from "@mui/material";

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
        <Typography variant="h6" gutterBottom>
          Lista de Usuários
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aqui será implementada a lista de usuários
        </Typography>
      </Paper>
    </Box>
  );
}
