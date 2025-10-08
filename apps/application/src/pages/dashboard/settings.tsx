import { Typography, Box, Paper } from "@mui/material";

export function SettingsPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Configurações
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Configure suas preferências do sistema
      </Typography>

      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Configurações do Sistema
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aqui serão implementadas as configurações
        </Typography>
      </Paper>
    </Box>
  );
}
