import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import ShorthandInput from "./components/ShorthandInput";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import { LoginResponse } from "./services/api";

// Theme configuration
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const App: React.FC = () => {
  const [auth, setAuth] = useState<LoginResponse | null>(() => {
    try {
      const saved = localStorage.getItem("auth");
      if (!saved) return null;

      const parsed = JSON.parse(saved);
      // Validate the parsed data has the expected structure
      if (
        parsed &&
        typeof parsed === "object" &&
        typeof parsed.token === "string" &&
        parsed.user &&
        typeof parsed.user === "object" &&
        typeof parsed.user.isAdmin === "boolean"
      ) {
        return parsed as LoginResponse;
      }
      // If the structure is invalid, clear the storage
      localStorage.removeItem("auth");
      return null;
    } catch (error) {
      // If there's any error parsing, clear the storage
      localStorage.removeItem("auth");
      return null;
    }
  });

  const handleLogin = (response: LoginResponse) => {
    setAuth(response);
    localStorage.setItem("auth", JSON.stringify(response));
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Shrthnder Web
              </Typography>
              {auth?.user.isAdmin ? (
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/user"
                    sx={{ mr: 1 }}
                  >
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/admin">
                    Admin Login
                  </Button>
                </>
              )}
            </Toolbar>
          </AppBar>

          {auth?.user.isAdmin ? (
            <AdminDashboard token={auth.token} onLogout={handleLogout} />
          ) : (
            <Routes>
              <Route
                path="/admin"
                element={
                  auth ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Login onLoginSuccess={handleLogin} isAdmin={true} />
                  )
                }
              />
              <Route
                path="/user"
                element={
                  auth ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Login onLoginSuccess={handleLogin} isAdmin={false} />
                  )
                }
              />
              <Route
                path="/"
                element={
                  <Container>
                    <ShorthandInput
                      token={auth?.token || ""}
                      onInputChange={() => {}}
                      onExpand={() => {}}
                    />
                  </Container>
                }
              />
            </Routes>
          )}
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
