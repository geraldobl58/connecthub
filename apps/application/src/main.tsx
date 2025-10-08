import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "./global.css";
import App from "./App.tsx";
import theme from "./theme";
import { QueryProvider } from "./providers/QueryProvider";
import AuthProvider from "./providers/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  </StrictMode>
);
