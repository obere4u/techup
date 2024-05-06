import TalentDashBoardHeader from "./components/TalentDashBoardHeader/Index";
import TalentDashBoardFooter from "./components/TalentDashboardFooter/Index";

import TalentDashBoardMainContent from "./TalentDashBoardMainContent/Index";
import SideBar from "./SideBar/Index";

export default function TalentDashBoard() {
  return (
    <div className="h-screen flex flex-col">
      {/*Header*/}
      <TalentDashBoardHeader />
      {/*Main content */}
      <div className=" flex flex-grow">
        <SideBar />
        <TalentDashBoardMainContent />
      </div>

      {/*Footer*/}
      <TalentDashBoardFooter />
    </div>
  );
}
