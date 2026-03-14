import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import HomeIcon from "@mui/icons-material/Home";

export default function NavBar() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: "Dashboard", path: "/" },
    { label: "API Tokens", path: "/tokens" },
    { label: "Providers", path: "/providers" },
    { label: "API Docs", path: "/api-docs" },
  ];

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <HomeIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" fontWeight={600} sx={{ mr: 4, color: "primary.main" }}>
          Bubbly Automation
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexGrow: 1 }}>
          {navLinks.map((link) => (
            <Button
              key={link.path}
              onClick={() => navigate(link.path)}
              color={location.pathname === link.path ? "primary" : "inherit"}
              variant={location.pathname === link.path ? "contained" : "text"}
              size="small"
              disableElevation
            >
              {link.label}
            </Button>
          ))}
        </Box>

        <Button
          onClick={() => signOut()}
          color="inherit"
          size="small"
        >
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
