import { Typography, Box } from "@mui/material";
import { SignupForm } from "../../components/SignupForm";

export function RegisterPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Criar Conta
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" mb={3}>
        Crie sua empresa e escolha um plano
      </Typography>

      <SignupForm />
    </Box>
  );
}
