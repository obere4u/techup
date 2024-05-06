import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IoIosPeople } from "react-icons/io";
import { FaRegHandshake } from "react-icons/fa6";
import { RiBookOpenFill } from "react-icons/ri";
import DashboardCard from "../DashboardCard/Index";
import { TALENT_API_URL } from "../../../API/talentAPI";
import { PARTNERS_API_URL } from "../../../API/partnerAPI.js";
import { RESOURCES_API_URL } from "../../../API/resourcesAPI.js";

export default function Dashboard() {
  // Talent query
  const { data: talentData } = useQuery({
    queryKey: ["talentData"],
    queryFn: async () =>
      await axios.get(TALENT_API_URL).then((res) => res.data),
  });

  // Partner query
  const { data: partnerData } = useQuery({
    queryKey: ["partnerData"],
    queryFn: async () =>
      await axios.get(PARTNERS_API_URL).then((res) => res.data),
  });

  // Resources query
  const { data: resourcesData } = useQuery({
    queryKey: ["resourcesData"],
    queryFn: async () =>
      await axios.get(RESOURCES_API_URL).then((res) => res.data),
  });

  // console.log(talentData, partnerData, resourcesData);

  return (
    <main className="px-8">
      <h2 className="mb-8 p-1 text-center text-2xl font-semibold">Dashboard</h2>
      <section className="flex space-x-8 justify-center items-center">
        <DashboardCard
          totalNumberOf={talentData?.length}
          title="Talents"
          icon={<IoIosPeople />}
          to="/admin/talents"
          totalName="Total Registration"
          loading={!talentData}
        />

        <DashboardCard
          totalNumberOf={partnerData?.length}
          title="Partners"
          icon={<FaRegHandshake />}
          to="/admin/partners"
          totalName="Total number of partners"
          loading={!partnerData}
        />

        <DashboardCard
          totalNumberOf={resourcesData?.length}
          title="Resources"
          icon={<RiBookOpenFill />}
          to="/admin/resources"
          totalName="Total number of resources"
          loading={!resourcesData}
        />
      </section>
    </main>
  );
}
