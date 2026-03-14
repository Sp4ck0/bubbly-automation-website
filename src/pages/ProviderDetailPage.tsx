import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/api";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type ProviderConfig = {
  name: string;
  apiKeyLabel: string;
  apiKeyHint?: string;
  baseUrlLabel?: string;
  baseUrlHint?: string;
};

const PROVIDERS: Record<string, ProviderConfig> = {
  govee: {
    name: "Govee",
    apiKeyLabel: "Govee API Key",
    apiKeyHint: "Found in the Govee app under Settings > About Us > Apply for API Key.",
  },
  homeassistant: {
    name: "Home Assistant",
    apiKeyLabel: "Long-Lived Access Token",
    apiKeyHint: "Generated in your HA profile under Security > Long-Lived Access Tokens.",
    baseUrlLabel: "Base URL",
    baseUrlHint: "e.g. http://192.168.1.100:8123",
  },
  blueair: {
    name: "BlueAir",
    apiKeyLabel: "X-AUTH-TOKEN",
    apiKeyHint: "Session token obtained from BlueAir login.",
    baseUrlLabel: "Account Email",
    baseUrlHint: "Your BlueAir account email address.",
  },
  hue: {
    name: "Philips Hue",
    apiKeyLabel: "Application Key",
    apiKeyHint: "Hue Bridge application key (username). Create via the Hue developer API.",
    baseUrlLabel: "Bridge URL",
    baseUrlHint: "e.g. http://192.168.1.100",
  },
  smartthings: {
    name: "SmartThings",
    apiKeyLabel: "Personal Access Token",
    apiKeyHint: "Generated at account.smartthings.com/tokens.",
  },
};

export default function ProviderDetailPage() {
  const { provider } = useParams<{ provider: string }>();
  const navigate = useNavigate();
  const config = provider ? PROVIDERS[provider] : undefined;

  const existing = useQuery(api.userKeys.getMyProvider, provider ? { provider } : "skip");
  const upsert = useMutation(api.userKeys.upsertMyKey);
  const remove = useMutation(api.userKeys.deleteMyKey);

  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (existing) {
      // Never pre-fill the key — it's masked and would overwrite the real value
      setBaseUrl(existing.baseUrl ?? "");
    }
  }, [existing]);

  if (!config || !provider) {
    return (
      <Box>
        <Typography>Unknown provider.</Typography>
        <Button onClick={() => navigate("/providers")}>Back</Button>
      </Box>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await upsert({ provider, apiKey: apiKey || undefined, baseUrl: baseUrl || undefined });
      setSuccess("Credentials saved.");
    } catch {
      setError("Failed to save credentials.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setError("");
    setSuccess("");
    setRemoving(true);
    try {
      await remove({ provider });
      navigate("/providers");
    } catch {
      setError("Failed to remove credentials.");
      setRemoving(false);
    }
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/providers")}
        sx={{ mb: 2 }}
        color="inherit"
      >
        Back to Providers
      </Button>

      <Typography variant="h5" fontWeight={700} mb={3}>
        {config.name}
      </Typography>

      <Card sx={{ maxWidth: 560 }}>
        <CardContent sx={{ p: 4 }}>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {existing && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Credentials are already configured. Enter new values to replace them.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSave} display="flex" flexDirection="column" gap={2}>
            <TextField
              label={config.apiKeyLabel}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required={!existing}
              fullWidth
              autoComplete="off"
              helperText={existing
                ? `Currently set (ends in ${existing.apiKey.slice(-4)}). Leave blank to keep existing.`
                : config.apiKeyHint}
              placeholder={existing ? "Leave blank to keep existing key" : ""}
            />

            {config.baseUrlLabel && (
              <TextField
                label={config.baseUrlLabel}
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                fullWidth
                autoComplete="off"
                helperText={config.baseUrlHint}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={saving || !apiKey.trim()}
              disableElevation
            >
              {saving ? "Saving…" : "Save Credentials"}
            </Button>
          </Box>

          {existing && (
            <>
              <Divider sx={{ my: 3 }} />
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemove}
                disabled={removing}
                fullWidth
              >
                {removing ? "Removing…" : "Remove Credentials"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
