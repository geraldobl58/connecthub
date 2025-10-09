import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { CheckCircle, Email, Login } from "@mui/icons-material";

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  const tenantId = searchParams.get("tenant_id");

  useEffect(() => {
    // Verificar se há parâmetros de sucesso do Stripe ou se é desenvolvimento
    const sessionId = searchParams.get("session_id");
    const tenantId = searchParams.get("tenant_id");
    const isDevelopment = window.location.hostname === "localhost";

    // Aceitar se tiver session_id do Stripe, tenant_id, ou estiver em desenvolvimento
    if (sessionId || tenantId || isDevelopment) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Verificando pagamento...</Typography>
      </Box>
    );
  }

  if (status === "error") {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Houve um problema com o seu pagamento. Entre em contato com o suporte.
        </Alert>
        <Button
          component={Link}
          to="/auth/register"
          variant="contained"
          fullWidth
        >
          Tentar Novamente
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent sx={{ textAlign: "center", p: 4 }}>
          <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />

          <Typography variant="h4" component="h1" gutterBottom>
            Pagamento Realizado com Sucesso!
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            Sua empresa foi criada com sucesso e o pagamento foi processado.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Email sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6">Verifique seu Email</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            Enviamos um email com suas credenciais de acesso. Verifique sua
            caixa de entrada e também a pasta de spam.
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Sua conta será ativada automaticamente após a confirmação do
            pagamento. Isso pode levar alguns minutos.
          </Alert>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              component={Link}
              to="/auth/login"
              variant="contained"
              startIcon={<Login />}
              size="large"
            >
              Fazer Login
            </Button>
          </Box>

          {tenantId && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 2, display: "block" }}
            >
              ID da Empresa: {tenantId}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
