import { useLocation } from "react-router-dom";
import Dashboard from "../components/Dashboard/Index";
import Partners from "../components/Partners/Index";
import Talents from "../components/Talents/Index";
import Selected from "../components/Selected/Index";
import Header from "../components/Header/Index";

const componentsByPathName = {
  "/admin": Dashboard,
  "/admin/partners": Partners,
  "/admin/talents": Talents,
  "/admin/selected": Selected,
};

export default function MainContent() {
  const location = useLocation();
  const ComponentName = componentsByPathName[location.pathname] || null;

  return (
    <div className="w-full">
      <div className="py-6 px-0">
        <Header />
      </div>
      {ComponentName && <ComponentName />}
    </div>
  );
}
