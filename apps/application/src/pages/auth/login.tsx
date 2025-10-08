import { Typography, Box } from "@mui/material";
import { LoginForm } from "../../components/LoginForm";

export function LoginPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Fazer Login
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" mb={3}>
        Entre com suas credenciais para acessar o sistema
      </Typography>

      <LoginForm />
    </Box>
  );
}
