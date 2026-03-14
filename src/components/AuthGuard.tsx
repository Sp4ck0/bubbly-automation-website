import { Outlet, Navigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { CircularProgress, Box } from "@mui/material";
import NavBar from "./NavBar";

export default function AuthGuard() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <NavBar />
      <Box sx={{ maxWidth: 960, mx: "auto", px: 2, py: 4 }}>
        <Outlet />
      </Box>
    </>
  );
}
