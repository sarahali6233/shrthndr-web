import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { login, LoginResponse } from "../services/api";

interface LoginProps {
  onLoginSuccess: (response: LoginResponse) => void;
  isAdmin: boolean;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, isAdmin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(email, password);
      if (isAdmin && !response.user.isAdmin) {
        setError("This login is for administrators only");
        return;
      }
      onLoginSuccess(response);
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "grey.100",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          {isAdmin ? "Admin Login" : "User Login"}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          {isAdmin
            ? 'Use "admin" for both username and password'
            : 'Use "user@tester.com" as username and "user" as password'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={isAdmin ? "Username" : "Email"}
            type={isAdmin ? "text" : "email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoComplete={isAdmin ? "username" : "email"}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="current-password"
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={{ mt: 3 }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
