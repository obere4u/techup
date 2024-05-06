import { Checkbox, Tooltip } from "flowbite-react";
import { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  updateSuccess,
  updateFailure,
  updateStart,
  updateFinish,
} from "../../../redux/user/userSlice";
import { TALENT_API_URL } from "../../../API/talentAPI";
import axios from "axios";

export default function Week({
  weekNum,
  courseTitle,
  linksToResources,
  assignments,
}) {
  // Handle checkbox state
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Initialize completedWeeks with the value from localStorage, if available
  const [completedWeeks, setCompletedWeeks] = useState(() => {
    const storedCompletedWeeks = localStorage.getItem("completedWeeks");
    return storedCompletedWeeks ? JSON.parse(storedCompletedWeeks) : [];
  });
  const access_token = localStorage.getItem("access_token");
  const currentUserId = currentUser?._id;

  // Update completedWeeks state and localStorage when data is fetched
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make API call to fetch current user data
        const response = await axios.get(`${TALENT_API_URL}/${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        // Dispatch action to update user data in Redux store
        dispatch(updateSuccess(response.data));

        // Update completedWeeks state
        const isWeekCompleted = response.data.isWeekCompleted || [];
        setCompletedWeeks(isWeekCompleted);

        // Store completedWeeks in localStorage
        localStorage.setItem("completedWeeks", JSON.stringify(isWeekCompleted));
      } catch (error) {
        console.error("An error occurred while fetching user data:", error);
        dispatch(updateFailure());
      }
    };

    // Fetch user data when component mounts
    fetchUserData();
  }, [dispatch, access_token, currentUserId]);

  useEffect(() => {
    if (currentUser?.isWeekCompleted) {
      // Use currentUser data from Redux store to initialize completedWeeks
      setCompletedWeeks(currentUser.isWeekCompleted);
    } else {
      // Default value if currentUser data is not available
      setCompletedWeeks([]);
    }
  }, [currentUser]);

  const totalWeeks = currentUser?.isWeekCompleted;

  const handleCheckboxState = async () => {
  try {
    // Toggle the completed status of the clicked week
    const updatedCompletedWeeks = totalWeeks.map((week, index) => ({
      week: index + 1, // Week numbers start from 1
      completed: index === weekNum - 1 ? !week.completed : week.completed,
    }));
    setCompletedWeeks(updatedCompletedWeeks);

    // Update localStorage with the toggled completed status
    localStorage.setItem('completedWeeks', JSON.stringify(updatedCompletedWeeks));

    // Dispatch updateStart action
    dispatch(updateStart());

    // Make API call to update the user's completed weeks
    const updateResponse = await axios.put(
      `${TALENT_API_URL}/update/${currentUser._id}`,
      { isWeekCompleted: updatedCompletedWeeks },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    // Handle the response
    if (updateResponse.status !== 200) {
      dispatch(updateFailure());
      const errorMsg =
        updateResponse.data?.message || "Failed to update profile";
      console.log("msg: ", errorMsg);
    }
    //if status is 200
    dispatch(updateSuccess(updateResponse.data));
  } catch (error) {
    console.error("An error occurred while updating profile:", error);
    dispatch(updateFailure());
  }
};


  // Checkbox custom style
  const checkboxCustomStyle = {
    root: {
      base: "h-3 w-3 rounded outline ",
      color: {
        dark: "text-green-800  ",
      },
    },
  };

  const defaultChecked = completedWeeks.some(
    (week) => week.week === weekNum && week.completed
  );

  return (
    <div className="flex ">
      <div className="mb-auto flex space-y-4 flex-col justify-center mx-auto md:mx-0  w-[90%] md-w-full shadow hover:shadow-md p-4 rounded-xl">
        <div className=" flex items-center justify-between">
          <p className="font-semibold text-[1.06rem]">Week {weekNum}</p>
          <Checkbox
            type="checkbox"
            theme={checkboxCustomStyle}
            color="dark"
            defaultChecked={defaultChecked}
            onChange={handleCheckboxState}
          />
        </div>
        <p className="capitalize text-[1.1rem] font-semibold">{courseTitle}</p>
        <div className="flex flex-col space-y-4">
          {linksToResources.length > 0 ? (
            linksToResources.map((linksToResource) => (
              <Tooltip
                key={linksToResource._id}
                content={linksToResource.linkTitle}
              >
                <a
                  href={linksToResource.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-4"
                >
                  <FaCircle className="text-[0.3rem]" />
                  <p className="line-clamp-1 underline text-blue-600 hover:text-blue-800  text-[1.05rem]">
                    {linksToResource.linkTitle}
                  </p>
                </a>
              </Tooltip>
            ))
          ) : (
            <p className="text-center">No resources for the week</p>
          )}
        </div>
        <div className="!mt-12 flex flex-col space-y-2">
          <p className="font-semibold ">
            {" "}
            {assignments.length === 0 || assignments.length == 1
              ? "Assignment"
              : "Assignments"}
          </p>

          <div className="flex flex-col space-y-4 ">
            {assignments.length > 0 ? (
              assignments.map((assignment) => {
                return (
                  <a
                    key={assignment._id}
                    href={assignment.assignmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-4 w-fit"
                  >
                    <FaCircle className="text-[0.5rem]" />
                    <p className="line-clamp-1 underline hover:text-blue-900 text-[1.05rem]">
                      {assignment.assignmentTitle}
                    </p>
                  </a>
                );
              })
            ) : (
              <p>No assignment </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Proptypes
Week.propTypes = {
  weekNum: PropTypes.number.isRequired,
  courseTitle: PropTypes.string.isRequired,
  linksToResources: PropTypes.array.isRequired,
  assignments: PropTypes.array.isRequired,
};
