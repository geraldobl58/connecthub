import {
  Typography,
  Box,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Button,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircle,
  Business,
  Email,
  Schedule,
  Launch,
  Phone,
  Chat,
  AccessTime,
} from "@mui/icons-material";
import { useDashboardData } from "../../hooks/usePlans";
import { RealTimeCountdown } from "../../components/real-time-countdown";

export function PlansPage() {
  const { plan, user, company, isLoading, isError, error } = useDashboardData();

  const calculateDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "TRIAL":
        return "warning";
      case "EXPIRED":
        return "error";
      case "CANCELLED":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "✅ ATIVO";
      case "TRIAL":
        return "⏳ TRIAL";
      case "EXPIRED":
        return "❌ EXPIRADO";
      case "CANCELLED":
        return "🚫 CANCELADO";
      default:
        return status;
    }
  };

  const generatePassword = () => {
    return "";
  };

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Planos
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (isError || !plan.data || !user.data || !company.data) {
    return (
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Planos
        </Typography>
        <Alert severity="error">
          {error?.message || "Erro ao carregar informações"}
        </Alert>
      </Box>
    );
  }

  const planInfo = plan.data;
  const userInfo = user.data;
  const companyInfo = company.data;

  const daysUntilExpiry = calculateDaysUntilExpiry(planInfo.planExpiresAt);
  const domain = `${companyInfo.tenantId}.connecthub.com`;
  const accessUrl = `${window.location.origin}/login?tenant=${companyInfo.tenantId}`;

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Detalhes da Assinatura
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Informações completas do seu plano e conta
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Coluna Principal */}
        <Box sx={{ flex: 2 }}>
          {/* Informações Principais */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Business /> Informações da Empresa
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Box sx={{ minWidth: "200px" }}>
                  <Typography variant="body2" color="text.secondary">
                    Empresa:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {companyInfo.name}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: "200px" }}>
                  <Typography variant="body2" color="text.secondary">
                    Plano:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {planInfo.name}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Limites:
                </Typography>
                <Typography variant="body1">
                  Até {planInfo.maxUsers} usuários,{" "}
                  {planInfo.maxProperties?.toLocaleString()} propriedades,{" "}
                  {planInfo.maxContacts?.toLocaleString()} contatos
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Box sx={{ minWidth: "200px" }}>
                  <Typography variant="body2" color="text.secondary">
                    Subdomínio:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {domain}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: "200px" }}>
                  <Typography variant="body2" color="text.secondary">
                    Email Admin:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {userInfo.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Box sx={{ minWidth: "200px" }}>
                  <Typography variant="body2" color="text.secondary">
                    ID da Conta:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontFamily="monospace"
                    fontSize="0.9rem"
                  >
                    {companyInfo.id}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: "200px" }}>
                  <Typography variant="body2" color="text.secondary">
                    Slug/TenantId:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {companyInfo.tenantId}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status:
                </Typography>
                <Chip
                  label={getStatusText(planInfo.status)}
                  color={getStatusColor(planInfo.status)}
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Credenciais de Acesso */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              🔐 Suas Credenciais de Acesso
            </Typography>

            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Box sx={{ minWidth: "200px" }}>
                <Typography variant="body2" color="text.secondary">
                  Email:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {userInfo.email}
                </Typography>
              </Box>
              <Box sx={{ minWidth: "200px" }}>
                <Typography variant="body2" color="text.secondary">
                  Senha:
                </Typography>
                <Typography
                  variant="body1"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {generatePassword()}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Política de Segurança */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              🔒 Política de Segurança da Senha
            </Typography>

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Contém pelo menos 1 letra maiúscula (A-Z)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Contém pelo menos 1 letra minúscula (a-z)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Contém pelo menos 1 número (0-9)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Contém pelo menos 1 símbolo (!@#$%&*)" />
              </ListItem>
            </List>

            <Alert severity="warning" sx={{ mt: 2 }}>
              <strong>⚠️ IMPORTANTE:</strong> Altere esta senha no primeiro
              acesso por segurança.
            </Alert>
          </Paper>

          {/* Primeiros Passos */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              🚀 Primeiros Passos na Plataforma
            </Typography>

            <List>
              {[
                {
                  number: "1",
                  title: "Faça seu primeiro login",
                  desc: "Use suas credenciais para acessar a plataforma e familiarize-se com a interface",
                },
                {
                  number: "2",
                  title: "Altere sua senha",
                  desc: "Por segurança, crie uma senha personalizada em Configurações > Perfil",
                },
                {
                  number: "3",
                  title: "Configure sua empresa",
                  desc: "Adicione logotipo, informações da empresa e personalize as configurações",
                },
                {
                  number: "4",
                  title: "Adicione sua equipe",
                  desc: "Convide usuários e configure permissões em Configurações > Usuários",
                },
                {
                  number: "5",
                  title: "Importe seus dados",
                  desc: "Importe contatos, propriedades e dados existentes usando nossas ferramentas",
                },
              ].map((step) => (
                <ListItem key={step.number} sx={{ alignItems: "flex-start" }}>
                  <ListItemIcon>
                    <Chip label={step.number} size="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={step.title}
                    secondary={step.desc}
                    primaryTypographyProps={{ fontWeight: "bold" }}
                  />
                </ListItem>
              ))}
            </List>

            <Alert severity="info" sx={{ mt: 2 }}>
              💡 <strong>Dica:</strong> Precisa de ajuda? Nossa equipe oferece
              onboarding gratuito para novos clientes!
            </Alert>
          </Paper>

          {/* Acesso à Plataforma */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.main", color: "white" }}>
            <Typography variant="h6" gutterBottom>
              🚀 Acessar Minha Plataforma
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Seu link de acesso: {accessUrl}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Launch />}
              onClick={() => window.open(accessUrl, "_blank")}
            >
              Abrir Plataforma
            </Button>
          </Paper>
        </Box>

        {/* Sidebar */}
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          {/* Contador de Tempo */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Schedule /> Tempo Restante
              </Typography>
              <RealTimeCountdown expiryDate={planInfo.planExpiresAt} />
              {daysUntilExpiry <= 7 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Seu plano expira em breve!
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Suporte */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📞 Suporte e Contato
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Email fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email:"
                    secondary="suporte@connecthub.com"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Telefone:"
                    secondary="(11) 99999-9999"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Chat fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Chat:"
                    secondary="Disponível na plataforma"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Horário:"
                    secondary="Seg-Sex, 8h às 18h"
                  />
                </ListItem>
              </List>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Se você tiver alguma dúvida ou precisar de assistência, nossa
                equipe está sempre pronta para ajudar. Não hesite em entrar em
                contato conosco através de qualquer um dos canais acima.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
