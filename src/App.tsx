import { CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  shape: {
    borderRadius: 10,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100%', minHeight: '100vh' }}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
