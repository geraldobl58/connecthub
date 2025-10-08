import { Typography, Box, Paper } from "@mui/material";

export function PropertiesPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Propriedades
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Gerencie todas as suas propriedades
      </Typography>

      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Lista de Propriedades
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aqui será implementada a lista de propriedades
        </Typography>
      </Paper>
    </Box>
  );
}
