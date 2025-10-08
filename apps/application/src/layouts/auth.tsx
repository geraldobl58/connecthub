import { Outlet } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children?: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 32px 64px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              color: "white",
              padding: 4,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              ConnectHub
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Plataforma de Gestão de Propriedades
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ padding: 4 }}>{children || <Outlet />}</Box>

          {/* Footer */}
          <Box
            sx={{
              padding: 3,
              backgroundColor: "grey.50",
              borderTop: "1px solid",
              borderColor: "grey.200",
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              © 2025 ConnectHub. Todos os direitos reservados.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
