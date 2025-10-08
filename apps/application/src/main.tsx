import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "./global.css";
import App from "./App.tsx";
import theme from "./theme";
import { QueryProvider } from "./providers/QueryProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
