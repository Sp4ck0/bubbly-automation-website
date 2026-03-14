import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", { email, password, flow: "signIn" });
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
      px={2}
    >
      <Box display="flex" alignItems="center" mb={3} gap={1}>
        <HomeIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5" fontWeight={700} color="primary">
          Bubbly Automation
        </Typography>
      </Box>

      <Card sx={{ width: "100%", maxWidth: 400 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
              autoComplete="email"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              size="large"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" mt={3} textAlign="center">
            Don't have an account?{" "}
            <Link component={RouterLink} to="/register">
              Create one
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
