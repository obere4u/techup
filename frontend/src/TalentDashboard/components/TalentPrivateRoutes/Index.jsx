import { Outlet, Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useAuthStatusTalent } from "../../useAuthStatusTalent/Index";

export default function TalentPrivateRoute() {
  const { loggedInTalent, checkStatusTalent } = useAuthStatusTalent();
  if (checkStatusTalent) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }
  return loggedInTalent ? (
    <Outlet />
  ) : (
    <Navigate to="/talent-signin/" />
  );
}
