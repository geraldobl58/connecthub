import { Typography, Box, Paper } from "@mui/material";

export function PlansPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Planos
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Gerencie os planos de assinatura
      </Typography>

      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Planos Disponíveis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aqui será implementada a gestão de planos
        </Typography>
      </Paper>
    </Box>
  );
}
