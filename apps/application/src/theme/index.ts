import { createTheme } from "@mui/material/styles";

// Tema base do Material-UI que funciona bem com Tailwind CSS
const baseTheme = createTheme({
  palette: {
    primary: {
      50: "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2196f3",
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",
      main: "#1976d2",
      contrastText: "#ffffff",
    },
    secondary: {
      50: "#fce4ec",
      100: "#f8bbd9",
      200: "#f48fb1",
      300: "#f06292",
      400: "#ec407a",
      500: "#e91e63",
      600: "#d81b60",
      700: "#c2185b",
      800: "#ad1457",
      900: "#880e4f",
      main: "#dc004e",
      contrastText: "#ffffff",
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#ed6c02",
    },
    info: {
      main: "#0288d1",
    },
    success: {
      main: "#2e7d32",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 300,
      lineHeight: 1.167,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 300,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 400,
      lineHeight: 1.167,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 400,
      lineHeight: 1.235,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 400,
      lineHeight: 1.334,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 8,
});

// Tema customizado que integra com Tailwind CSS
const customTheme = createTheme(baseTheme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          height: "100%",
        },
        body: {
          height: "100%",
          margin: 0,
          padding: 0,
        },
        "#root": {
          height: "100%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "0.375rem", // Tailwind's rounded-md
          fontWeight: 500,
          padding: "0.5rem 1rem",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        contained: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          "&:hover": {
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        outlined: {
          borderWidth: "1px",
          "&:hover": {
            borderWidth: "1px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem", // Tailwind's rounded-lg
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.375rem", // Tailwind's rounded-md
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: baseTheme.palette.primary.main,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: "2px",
              borderColor: baseTheme.palette.primary.main,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem", // Tailwind's rounded-lg
        },
        elevation1: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
        elevation2: {
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
        elevation3: {
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.primary.main,
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      },
    },
  },
});

export default customTheme;
