import { useQuery } from "convex/react";
import { api } from "@convex/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Skeleton,
} from "@mui/material";
import TokenIcon from "@mui/icons-material/VpnKey";
import PlugIcon from "@mui/icons-material/Bolt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function DashboardPage() {
  const tokens = useQuery(api.tokens.listTokens);
  const providers = useQuery(api.userKeys.listMyProviders);

  type Token = NonNullable<typeof tokens>[number];
  const activeTokens = tokens?.filter((t: Token) => !t.revokedAt && (!t.expiresAt || t.expiresAt > Date.now())) ?? [];

  const lastUsed = tokens
    ?.flatMap((t: Token) => (t.lastUsedAt ? [t.lastUsedAt] : []))
    .sort((a: number, b: number) => b - a)[0];

  const stats = [
    {
      label: "Active API Tokens",
      value: tokens === undefined ? null : activeTokens.length,
      icon: <TokenIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      label: "Configured Providers",
      value: providers === undefined ? null : providers.length,
      icon: <PlugIcon sx={{ fontSize: 40, color: "success.main" }} />,
    },
    {
      label: "Last API Activity",
      value: lastUsed
        ? new Date(lastUsed).toLocaleString()
        : tokens === undefined
        ? null
        : "Never",
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: "warning.main" }} />,
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={4}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <Card>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
                {stat.icon}
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  {stat.value === null ? (
                    <Skeleton width={80} height={32} />
                  ) : (
                    <Typography variant="h6" fontWeight={600}>
                      {stat.value}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
