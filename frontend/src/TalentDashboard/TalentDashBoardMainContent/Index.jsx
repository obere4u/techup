import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TalentDashBoardMain from "../TalentDashboardMain/Index";
import Resources from "../components/Resources/Index";
import Weeks from "../components/Week/Index";
import Profile from "../components/Profile/Index";

export default function TalentDashBoardMainContent() {
  const location = useLocation();
  const [urlTab, setUrlTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const currentUrlTab = urlParams.get("tab");

    setUrlTab(currentUrlTab);
  }, [location]);

  return (
    <div className="h-full flex w-full">
      {/*Display based of route param using the tab*/}
      <div className="h-full mb-8 flex-grow ml-1 md:ml-8">
        {(urlTab === "resources" && <Resources />) ||
          (urlTab === "weeks" && <Weeks />) ||
          (urlTab === "profile" && <Profile />) ||
          (urlTab === null && <TalentDashBoardMain />)}
      </div>
    </div>
  );
}
