import { Outlet, Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useAuthStatusAdmin } from "../../hooks/useAuthStatusAdmin/Index";

export default function AdminPrivateRoute() {
  const { loggedInAdmin, checkStatusAdmin } = useAuthStatusAdmin();
  if (checkStatusAdmin) {
    return (
      <div className="flex space-x-4">
        Loading <CircularProgress />
      </div>
    );
  }
  return loggedInAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/admin-signin/" />
  );
}
