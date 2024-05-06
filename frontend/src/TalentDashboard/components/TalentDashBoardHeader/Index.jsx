import { useState, useEffect } from "react";
import { format, getDay, getHours, getMinutes } from "date-fns";
import { useSelector } from "react-redux";
import { Avatar, Dropdown, Navbar, Tooltip } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import kinplusLogo from "../../../assets/images//kinplus.jpg";
import LogoutButton from "../LogoutButton/Index";
import { RiLogoutCircleRLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { RxDropdownMenu } from "react-icons/rx";
import axios from "axios";
import { AUTH_API_URL } from "../../../API/Auth";
import { signOutSuccess } from "../../../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
// import { FaMoon, FaSun } from "react-icons/fa6";
// import { toggleTheme } from "../../../redux/theme/themeSlice";

export default function TalentDashBoardHeader() {
  const [daysOfWeek, setDaysOfWeek] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const formattedDate = format(currentTime, "MMMM do, yyyy");
  const { currentUser } = useSelector((state) => state.user); //get current user from redux
  // const { theme } = useSelector((state) => state.theme);
  const [urlTab, setUrlTab] = useState("");
  const dispatch = useDispatch();


  const location = useLocation();
  const navigate = useNavigate()
  // const dispatch = useDispatch();
  // console.log(currentUser);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const currentUrlTab = urlParams.get("tab");

    setUrlTab(currentUrlTab);
  }, [location]);

  //time
  useEffect(() => {
    const dayOfWeek = getDay(currentTime);
    switch (dayOfWeek) {
      case 0:
        setDaysOfWeek("Sunday");
        break;
      case 1:
        setDaysOfWeek("Monday");
        break;
      case 2:
        setDaysOfWeek("Tuesday");
        break;
      case 3:
        setDaysOfWeek("Wednesday");
        break;
      case 4:
        setDaysOfWeek("Thursday");
        break;
      case 5:
        setDaysOfWeek("Friday");
        break;
      case 6:
        setDaysOfWeek("Saturday");
        break;
      default:
        setDaysOfWeek("");
        break;
    }

    // Update the time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentTime]);

  const currentTimeHour = getHours(currentTime).toString().padStart(2, "0");
  const currentTimeMinutes = getMinutes(currentTime)
    .toString()
    .padStart(2, "0");

  const NavbarCustomStyle = {
    root: {
      base: "py-3  pl-5 flex items-center justify-center w-full border-b dark:border-gray-700 dark:bg-gray-800 sm:px-4",
      rounded: {
        off: "",
      },
      bordered: {
        on: "border",
        off: "",
      },
      inner: {
        base: "w-full flex items-center justify-between",
        fluid: {
          on: "",
          off: "container",
        },
      },
    },
    brand: {
      base: "flex space-x-4 items-center",
    },
  };

  //show a confirmation modal with sweet alert
  const handleLogout = () => {
    Swal.fire({
      title: "Do you wish to logout?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
      allowOutsideClick: false,
      customClass: {
        actions: "my-actions",
        confirmButton: "order-2 right-gap",
        denyButton: "order-3",
      },
    }).then(async (result) => {
      /*
       *  if "ok" is clicked
       * Make a POST API call
       *  clear authentication token from local storage
       *  Redirect to logout route
       * */
      if (result.isConfirmed) {
        try {
          const userSignOutResponse = await axios.post(
            AUTH_API_URL + "/logout"
          );
          // Display success message
          Swal.fire({
            icon: "success",
            text: userSignOutResponse.data,
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: "top",
          });
          dispatch(signOutSuccess())
          localStorage.removeItem("access_token");
          navigate("/");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <Navbar theme={NavbarCustomStyle}>
      {/* Hidden for medium screens and above */}
      <div className="w-20 ">
        <Link>
          <img
            src={kinplusLogo}
            alt=""
            className="w-full"
            href="talent-dashboard"
          />
        </Link>
      </div>
      {/* Hidden for small screens */}
      <Navbar.Brand>
        <div className="hidden lg:flex space-x-2">
          <span>{daysOfWeek}</span>
          <span>{formattedDate}</span>
          <div className="flex">
            <span>{currentTimeHour}</span> : <span>{currentTimeMinutes}</span>
          </div>
        </div>
      </Navbar.Brand>
      {/*Dark mode and Profile*/}
      {/*theme toggle*/}
      {/*
      <Navbar.Brand>
      <Button
      className="w-12 h-10 sm:inline hidden"
      color="gray"
      pill
      onClick={() => dispatch(toggleTheme())}
      >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
      </Button>
    </Navbar.Brand>*/}
      {/*Profile details*/}
      {/* Profile and settings */}
      <div className="flex ">
        <Dropdown
          trigger="hover"
          inline
          arrowIcon={false}
          label={
            <div className="flex items-center space-x-1 w-[120px] md:w-[180px]">
              <Avatar
                rounded
                className="hidden sm:flex mx-auto lg:mx-0"
              />
              {/*show hamburger menu*/}
              <RxDropdownMenu className="text-3xl w-full sm:hidden"/>
              <span className="text-blue-900 font-bold truncate hidden md:inline">
                {currentUser?.fullName}
              </span>
            </div>
          }
        >
          <Dropdown.Item>
            <Link
              to={"/talent-dashboard"}
              className={`mx-auto font-semibold text-lg ${
                urlTab === null ? "text-blue-700" : "hover:text-blue-700"
              }`}
            >
              Dashboard
            </Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link
              to={"/talent-dashboard?tab=profile"}
              className={`mx-auto font-semibold text-lg ${
                urlTab === "profile" ? "text-blue-700" : "hover:text-blue-700"
              }`}
            >
              My Profile
            </Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link
              to={"/talent-dashboard?tab=resources"}
              className={`mx-auto font-semibold text-lg ${
                urlTab === "resources" ? "text-blue-700" : "hover:text-blue-700"
              }`}
            >
              Resources
            </Link>
          </Dropdown.Item>
          {/*adds a space between the last dropdown item and logout button */}
          <div className="hidden sm:flex  h-20">
            {/* Logout button */}
            <LogoutButton />
          </div>
          {/*Small screen*/}
          <div className="mt-[2em] flex items-center justify-center w-full text-center sm:hidden">
            <Tooltip
              content="Sign out"
              trigger="hover"
            >
              <RiLogoutCircleRLine
                className=" text-center text-red-600 text-3xl"
                onClick={handleLogout}
              />
            </Tooltip>
          </div>
        </Dropdown>
      </div>{" "}
    </Navbar>
  );
}
