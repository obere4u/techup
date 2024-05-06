import { useEffect, useState } from "react";
import Week from "../Week/Index";
import { useSelector } from "react-redux";
import { format, getHours } from "date-fns";
import "./style.css";
import { RESOURCES_API_URL } from "../../../API/resourcesAPI";
import axios from "axios";

export default function Resources() {
  const { currentUser } = useSelector((state) => state.user);
  const [greetUser, setGreetUser] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date().getHours());
  const formattedDate = format(currentTime, "HH:mm:ss");
  const [resourcesData, setResourcesData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const currentTimeHour = getHours(currentTime).toString().padStart(2, "0");

    switch (true) {
      case currentTimeHour >= 0 && currentTimeHour < 12:
        setGreetUser("Good Morning");
        break;
      case currentTimeHour >= 12 && currentTimeHour < 18:
        setGreetUser("Good Afternoon");
        break;
      case currentTimeHour >= 18 && currentTimeHour < 24:
        setGreetUser("Good Evening");
        break;

      default:
        setGreetUser("Howdy! ");
    }

    // Update the time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentTime, formattedDate]);

  // GET all resources
  const getAllResources = async () => {
    try {
      const allResources = await axios.get(RESOURCES_API_URL);
      const allResourcesData = allResources.data;

      setResourcesData(allResourcesData);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false); // Set loading to false after API call completes
    }
  };

  useEffect(() => {
    getAllResources();
  }, []);

  // Filter resources based on currentUser Program Of Choice
  const filteredResourcesData = resourcesData.filter(
    (resourceData) => resourceData.program === currentUser?.programOfChoice
  );

  return (
    <div className="flex flex-col space-y-4">
      <h1 className=" p-1 text-center">
        <span className="">{greetUser}</span>
        <span className="font-semibold "> {currentUser.fullName}</span>
      </h1>
      {loading ? ( // Display loading message while loading
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-3">
          {filteredResourcesData.length > 0 ? (
            filteredResourcesData.map((resourceData) => {
              const weekNum = resourceData.week;
              const courseTitle = resourceData.course?.title;
              const linksToResources = resourceData.course?.links;
              const weekAssignments = resourceData.assignments;
              return (
                <Week
                  key={resourceData._id}
                  weekNum={weekNum}
                  courseTitle={courseTitle}
                  linksToResources={linksToResources}
                  assignments={weekAssignments}
                />
              );
            })
          ) : (
            <p className="">No resource(s) available</p>
          )}
        </div>
      )}
    </div>
  );
}

