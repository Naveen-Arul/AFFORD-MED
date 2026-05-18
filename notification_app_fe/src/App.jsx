import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import AllNotifications from "./pages/AllNotifications";
import PriorityNotifications from "./pages/PriorityNotifications";

const theme = createTheme({
  palette: {
    primary: { main: "#1d4ed8" },
    secondary: { main: "#0284c7" },
    background: { default: "#f8fafc" },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/all" replace />} />
          <Route path="/all" element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityNotifications />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
