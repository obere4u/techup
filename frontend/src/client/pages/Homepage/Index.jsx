import PartnerCard from "../../components/Cards/PartnerCard";
import TalentCard from "../../components/Cards/TalentCard";
import ClientLayout from "../../utils/ClientLayout/Index";

export default function Homepage() {
  return (
    <ClientLayout>
      <div className="my-8 w-[90%] lg:w-[70%] mx-auto flex flex-col space-y-8 items-center lg:space-y-0 lg:flex-row lg:justify-between">
        <TalentCard />
        <PartnerCard />
      </div>
    </ClientLayout>
  );
}
