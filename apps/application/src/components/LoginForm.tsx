import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Alert, Box, Link as MuiLink } from "@mui/material";
import { useLogin } from "../hooks/useAuth";

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const loginMutation = useLogin();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email deve ter um formato válido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      // Redirecionar para o dashboard após login bem-sucedido
      navigate("/dashboard");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        autoFocus
        error={!!errors.email}
        helperText={errors.email}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Senha"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password}
      />

      {loginMutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Erro ao fazer login. Verifique suas credenciais.
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loginMutation.isPending}
        size="large"
      >
        {loginMutation.isPending ? "Entrando..." : "Entrar"}
      </Button>

      <Box sx={{ textAlign: "center" }}>
        <MuiLink component={Link} to="/auth/register" variant="body2">
          Não tem uma conta? Cadastre-se
        </MuiLink>
      </Box>
    </Box>
  );
}
