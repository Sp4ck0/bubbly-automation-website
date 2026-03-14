import { useQuery } from "convex/react";
import { api } from "@convex/api";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";

const PROVIDER_META: Record<string, { name: string; description: string }> = {
  govee: { name: "Govee", description: "Govee smart lights and home devices." },
  homeassistant: {
    name: "Home Assistant",
    description: "Self-hosted Home Assistant instance. Supports lights, switches, climate, locks, and covers.",
  },
  blueair: {
    name: "BlueAir",
    description: "BlueAir air purifiers (legacy API — Classic, Sense, Sense+ models).",
  },
  hue: {
    name: "Philips Hue",
    description: "Philips Hue smart lights via a local Hue Bridge.",
  },
  smartthings: {
    name: "SmartThings",
    description: "Samsung SmartThings cloud platform.",
  },
};

const ALL_PROVIDERS = Object.keys(PROVIDER_META);

export default function ProvidersPage() {
  const configured = useQuery(api.userKeys.listMyProviders) ?? [];
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Provider Credentials
      </Typography>

      <Card>
        <List disablePadding>
          {ALL_PROVIDERS.map((id, idx) => {
            const meta = PROVIDER_META[id];
            const isConfigured = configured.includes(id);
            return (
              <ListItem
                key={id}
                divider={idx < ALL_PROVIDERS.length - 1}
                sx={{ py: 2, px: 3 }}
                secondaryAction={
                  <Button
                    variant={isConfigured ? "outlined" : "contained"}
                    size="small"
                    startIcon={<SettingsIcon />}
                    onClick={() => navigate(`/providers/${id}`)}
                    disableElevation
                  >
                    {isConfigured ? "Edit" : "Configure"}
                  </Button>
                }
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography fontWeight={600}>{meta.name}</Typography>
                      <Chip
                        label={isConfigured ? "Configured" : "Not configured"}
                        size="small"
                        color={isConfigured ? "success" : "default"}
                      />
                    </Box>
                  }
                  secondary={meta.description}
                />
              </ListItem>
            );
          })}
        </List>
      </Card>
    </Box>
  );
}
