import { Typography, Paper, Box, Card, CardContent } from "@mui/material";
import { TrendingUp, People, Home, AttachMoney } from "@mui/icons-material";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  growth?: string;
}

function StatsCard({ title, value, icon, color, growth }: StatsCardProps) {
  return (
    <Card sx={{ height: "100%", mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}.100`,
              color: `${color}.600`,
              borderRadius: 2,
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {growth && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TrendingUp sx={{ fontSize: 16, color: "success.main", mr: 0.5 }} />
            <Typography variant="caption" color="success.main">
              {growth}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Visão geral da sua plataforma de gestão de propriedades
      </Typography>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr 1fr",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <StatsCard
          title="Total de Propriedades"
          value="1,234"
          icon={<Home />}
          color="primary"
          growth="+12% este mês"
        />
        <StatsCard
          title="Usuários Ativos"
          value="5,678"
          icon={<People />}
          color="success"
          growth="+8% este mês"
        />
        <StatsCard
          title="Receita Mensal"
          value="R$ 45,890"
          icon={<AttachMoney />}
          color="warning"
          growth="+15% este mês"
        />
        <StatsCard
          title="Taxa de Ocupação"
          value="87%"
          icon={<TrendingUp />}
          color="info"
          growth="+3% este mês"
        />
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 3,
        }}
      >
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Receita dos Últimos 12 Meses
          </Typography>
          <Box
            sx={{
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "grey.50",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Gráfico de receita será implementado aqui
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Atividades Recentes
          </Typography>
          <Box sx={{ mt: 2 }}>
            {[
              "Nova propriedade cadastrada",
              "Usuário João fez login",
              "Pagamento processado - R$ 1,500",
              "Nova reserva confirmada",
              "Propriedade atualizada",
            ].map((activity, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  pb: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2" fontWeight="medium">
                  {activity}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Há {index + 1} hora{index > 0 ? "s" : ""}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
