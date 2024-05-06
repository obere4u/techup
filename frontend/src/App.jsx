import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./client/pages/Homepage/Index";
import ScrollToTop from "./client/components/scrollToTop/Index";
import ThankYou from "./client/pages/ThankYou/Index";
import TalentForm from "./client/pages/Form/TalentForm/Index";
import PartnerForm from "./client/pages/Form/PartnerForm/Index";
import PageNotFound from "./client/components/PageNotFound/Index";
import Admin from "./admin/Index";
import AdminSignIn from "./admin/pages/AdminSignin/Index";
import TalentPrivateRoute from "./TalentDashboard/components/TalentPrivateRoutes/Index";
import AdminPrivateRoute from "./admin/components/AdminPrivateRoutes/Index";
import TalentDashBoard from "./TalentDashboard/Index";
import TalentSignin from "./TalentDashboard/pages/TalentSignin/Index";
import ForgotPassword from "./TalentDashboard/pages/ForgotPassword/Index";
import ResetPassword from "./TalentDashboard/pages/ResetPassword/Index";
import Talents from "./admin/components/Talents/Index";

export default function App() {
  return (
    <main className="relative flex flex-col h-screen">
      <Router>
        {/*makes page start from top when route changes */}
        <ScrollToTop />

        <Routes>
          {/*Admin route starts*/}
          <Route
            path="/admin/*"
            element={<AdminPrivateRoute />}
          >
            <Route
              index
              element={<Admin />}
            />
          </Route>
          <Route
            path="/admin-signin"
            element={<AdminSignIn />}
          />
          <Route
            path="/admin/talents"
            element={<Talents />}
          />
          {/*Admin route ends*/}

          {/*Talent route starts*/}
          <Route
            path="/talent-dashboard/*"
            element={<TalentPrivateRoute />}
          >
            <Route
              index
              element={<TalentDashBoard />}
            />
          </Route>
          <Route
            path="/talent-signin"
            element={<TalentSignin />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/reset-password/"
            element={<ResetPassword />}
          />
          {/*Talent route ends*/}

          {/*Other route starts*/}
          <Route
            exact
            path="/"
            element={<Homepage />}
          />
          <Route
            path="/talent"
            element={<TalentForm />}
          />
          <Route
            path="/partner"
            element={<PartnerForm />}
          />
          <Route
            path="/thank-you"
            element={<ThankYou />}
          />
          <Route
            path="*"
            element={<PageNotFound />}
          />
          {/*Other route ends*/}
        </Routes>
      </Router>
    </main>
  );
}
