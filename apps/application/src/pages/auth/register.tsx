import { Typography, Paper, Box } from "@mui/material";

export function RegisterPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Criar Conta
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" mb={3}>
        Preencha os dados para criar sua conta
      </Typography>

      <Paper sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Formulário de cadastro será implementado aqui
        </Typography>
      </Paper>
    </Box>
  );
}
