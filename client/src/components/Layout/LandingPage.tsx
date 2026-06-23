import { useState } from "react";
import api from "@/services/api.tsx";
import roleRoute from "@/utils/roleRoute";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Icon,
} from "@mui/material";

export default function LandingPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const user = await api.post("/auth/login", { email, password });
      setUser(user.data);
      navigate(roleRoute[user.data.roleName]);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Invalid email or password");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
      }}
    >
      <Card sx={{ width: 360, borderRadius: 3, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                bgcolor: "primary.main",
                borderRadius: "50%",
                p: 1.5,
                mb: 1,
                display: "flex",
              }}
            >
              {/* <LockOutlinedIcon sx={{ color: "white" }} /> */}
              <Icon sx={{ color: "white" }}>lockoutlined</Icon>
            </Box>
            <Typography variant="h6">Sign in</Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              sx={{ mb: 3 }}
            />
            <Button type="submit" variant="contained" fullWidth size="large">
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
