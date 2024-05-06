import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { RESOURCES_API_URL } from "../../../API/resourcesAPI";
import { FaCircle } from "react-icons/fa";
import { FcApproval } from "react-icons/fc";
import { getISOWeek, startOfWeek } from "date-fns";
import { Tooltip } from "flowbite-react";
import {  useDispatch } from "react-redux";
import {
  updateSuccess,
  updateFailure,
  updateStart,
  updateFinish,
} from "../../../redux/user/userSlice";
import { TALENT_API_URL } from "../../../API/talentAPI";


export default function WeekContents() {
  const { currentUser } = useSelector((state) => state.user);
  const [currentWeekResources, setCurrentWeekResources] = useState([]);
  const [loading, setLoading] = useState(true);
  // Handle checkbox state
  const dispatch = useDispatch();
  const access_token = localStorage.getItem("access_token");
  const currentUserId = currentUser?._id;

  useEffect(() => {
    const fetchUserData = async () => {
      dispatch(updateStart());
      try {
        // Make API call to fetch current user data
        const response = await axios.get(`${TALENT_API_URL}/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        // Dispatch action to update user data in Redux store
        dispatch(updateSuccess(response.data));
      } catch (error) {
        // console.error("An error occurred while fetching user data:", error);
        dispatch(updateFailure());
      }finally{
        dispatch(updateFinish());
      }
    };

    // Fetch user data when component mounts
    fetchUserData();
  }, [dispatch, access_token, currentUserId]);

  // Filter resources based on currentUser Program Of Choice
  const filteredResourcesData = currentWeekResources.filter(
    (resourceData) => resourceData.program === currentUser?.programOfChoice
  );

  //fetch the resources based of week number starting from 1
  useEffect(() => {
    const fetchCurrentWeekResources = async () => {
      try {
        const startOfCurrentWeek = startOfWeek(new Date(), {
          weekStartsOn: 0, // Start the week from Sunday
        });

        const currentWeekNumber = getISOWeek(startOfCurrentWeek); // Get ISO week number

        // Adjust the week number to start from 1
        const adjustedWeekNumber = currentWeekNumber - 13;

        // Fetch resources for the current week from the backend
        const currentWeekResponse = await axios.get(
          `${RESOURCES_API_URL}/${adjustedWeekNumber}`
        );

        // Set the current week's resources
        setCurrentWeekResources(currentWeekResponse.data);
      } catch (error) {
        console.error("Error fetching current week resources:", error);
      } finally {
        setLoading(false); // Set loading state to false once data is fetched
      }
    };

    fetchCurrentWeekResources();
  }, []);

  return (
    <div className="flex flex-col-reverse md:w-[95%] md:flex-row  md:justify-center md:space-y-0 md:space-x-8">
      {/* Weeks resources */}
      <div className="!mt-12 md:!mt-0 md:shadow-md w-full px-4">
        {loading ? ( // Display loading indicator if data is being fetched
          <p>Loading...</p>
        ) : filteredResourcesData.length > 0 ? ( // Render current week's resources if it's not empty
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-semibold text-center text-blue-900 !mb-8">
              Current <span className="font-semibold">week resources</span>{" "}
            </h2>
            {filteredResourcesData.map((currentWeekResource) => (
              <div key={currentWeekResource._id}>
                <p className="text-[1.05rem] md:text-[1.3rem] font-semibold">
                  {currentWeekResource.course.title}
                </p>
                <hr />
                {/* Links to resources */}
                <p className="mt-8 text-[1.1rem] md:text-[1.15rem] font-semibold">
                  Resources
                </p>
                <div className=" !mt-4 !mb-8 flex flex-col space-y-2 md:pr-10">
                  {currentWeekResource.course?.links?.map(
                    (currentWeekLinkToResource) => (
                      <Tooltip
                        content={currentWeekLinkToResource.linkTitle}
                        key={currentWeekLinkToResource._id}
                      >
                        <a
                          href={currentWeekLinkToResource.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-2"
                        >
                          <FaCircle className="text-[0.3rem]" />
                          <p className="line-clamp-1 underline text-blue-600 hover:text-opacity-75">
                            {currentWeekLinkToResource.linkTitle}
                          </p>
                        </a>
                      </Tooltip>
                    )
                  )}
                </div>
                {/* Links to assignments */}
                <div className="!my-8 flex flex-col space-y-2">
                  <p className="text-[1.1rem] md:text-[1.15rem] font-semibold">
                    {currentWeekResource.assignments.length === 0 ||
                    currentWeekResource.assignments.length == 1
                      ? "Assignment"
                      : "Assignments"}
                  </p>
                  {currentWeekResource.assignments.length > 0 ? (
                    currentWeekResource.assignments.map((assignment) => {
                      // console.log(assignment);
                      return (
                        <Tooltip
                          content={assignment.assignmentTitle}
                          key={assignment._id}
                        >
                          <a
                            href={assignment.assignmentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center space-x-2"
                          >
                            <FaCircle className="text-[0.3rem]" />
                            {/* Truncate assignment title */}
                            <p className=" underline text-blue-600 hover:text-opacity-75">
                              {assignment.assignmentTitle}
                            </p>
                          </a>
                        </Tooltip>
                      );
                    })
                  ) : (
                    <p>No assignment</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No resource(s) available for this week.</p>
        )}
      </div>

      {/* Completed weeks */}
      <div className="w-full md:shadow-md">
        <div className="flex justify-center items-center space-x-2 font-semibold text-[1.13rem] mb-5 text-blue-900 ">
          <span>Completed weeks</span>
          <div>
            <span className="!text-green-500">
              {currentUser?.isWeekCompleted &&
                currentUser?.isWeekCompleted.filter(
                  (weekCompleted) => weekCompleted.completed
                ).length}
            </span>
            /{currentUser?.isWeekCompleted.length}
          </div>
        </div>
        {/* Render completed weeks details */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
          {currentUser?.isWeekCompleted &&
            currentUser?.isWeekCompleted
              .filter((weekCompleted) => weekCompleted.completed)
              .map((weekCompleted) => (
                <div
                  key={weekCompleted.week}
                  className="flex items-center space-x-1 px-2 w-full"
                >
                  <span> Week {weekCompleted.week}</span> <FcApproval />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
