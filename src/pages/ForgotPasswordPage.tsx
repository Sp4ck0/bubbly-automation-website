import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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

type Step = "request" | "verify";

export default function ForgotPasswordPage() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", { email, flow: "reset" });
      setStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await signIn("password", { email, code, newPassword, flow: "reset-verification" });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code.");
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
          <Typography variant="h6" fontWeight={600} mb={1}>
            Reset Password
          </Typography>

          {success ? (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                Password reset successfully.
              </Alert>
              <Button fullWidth variant="contained" component={RouterLink} to="/login">
                Sign In
              </Button>
            </>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {step === "request" ? (
                <Box component="form" onSubmit={handleRequest} display="flex" flexDirection="column" gap={2}>
                  <Typography variant="body2" color="text.secondary">
                    Enter your email and we'll send you a reset code.
                  </Typography>
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
                  <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
                    {loading ? "Sending…" : "Send Reset Code"}
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleVerify} display="flex" flexDirection="column" gap={2}>
                  <Typography variant="body2" color="text.secondary">
                    Enter the code sent to <strong>{email}</strong> and your new password.
                  </Typography>
                  <TextField
                    label="Reset Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    fullWidth
                    autoFocus
                    autoComplete="one-time-code"
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    fullWidth
                    autoComplete="new-password"
                    helperText="At least 8 characters"
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    fullWidth
                    autoComplete="new-password"
                  />
                  <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
                    {loading ? "Resetting…" : "Reset Password"}
                  </Button>
                  <Button variant="text" size="small" onClick={() => setStep("request")}>
                    Resend code
                  </Button>
                </Box>
              )}
            </>
          )}

          <Typography variant="body2" color="text.secondary" mt={3} textAlign="center">
            <Link component={RouterLink} to="/login">
              Back to Sign In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
