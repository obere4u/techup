import { Sidebar, Tooltip } from "flowbite-react";
import { RxDashboard } from "react-icons/rx";
import { RiBookOpenFill, RiLogoutCircleRLine } from "react-icons/ri";
import { HiUser } from "react-icons/hi";
import LogoutButton from "../components/LogoutButton/Index";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import "./styles.css";
import Swal from "sweetalert2";
import { AUTH_API_URL } from "../../API/Auth";
import axios from "axios";
import { signOutSuccess } from "../../redux/user/userSlice.js";
import { useDispatch } from "react-redux";

export default function SideBar() {
  const location = useLocation();
  const [urlTab, setUrlTab] = useState("");
  const [isExpanded, setIsExpanded] = useState(true); // State for controlling sidebar expansion
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const currentUrlTab = urlParams.get("tab");
    setUrlTab(currentUrlTab);
  }, [location]);

  // Function to toggle sidebar expansion
  const toggleSidebar = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const SidebarCustomTheme = {
    root: {
      base: `!mb-12 hidden h-full relative pt-2 pb-5 md:flex md:flex-col border-r  text-lg dark:bg-gray-800 md:items-center md:justify-between`,
      inner:
        "h-full w-full flex flex-col  overflow-y-auto overflow-x-hidden dark:bg-gray-800",
      collapsed: {
        on: "w-16",
        off: "w-48",
      },
    },
    items: {
      base: "px-8 h-full flex flex-col items-center",
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-xl font-normal text-gray-900 hover:text-blue-700 dark:text-white dark:hover:bg-gray-700",
      active: "text-blue-700 font-bold",
      collapsed: {
        insideCollapse: " w-full transition duration-75",
      },
      icon: {
        base: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        active: "text-blue-700 font-bold dark:text-gray-100",
      },
    },
    itemGroup: {
      base: "mt-8 flex flex-col space-y-8 border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700",
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
    <Sidebar
      theme={SidebarCustomTheme}
      collapsed={isExpanded && "on"}
    >
      <Sidebar.Items>
        {/* Toggle sidebar button */}
        <div
          className="w-8 h-8 bg-blue-400 rounded-full absolute -right-[15.5px] -top-4 flex items-center justify-center cursor-pointer"
          onClick={toggleSidebar}
        >
          {isExpanded ? (
            <IoIosArrowForward className="text-white font-bold text-2xl" />
          ) : (
            <IoIosArrowBack className="text-white font-bold text-2xl" />
          )}
        </div>

        {/* Sidebar Items */}
        <Sidebar.ItemGroup first="true">
          <Link to={"/talent-dashboard"}>
            <Sidebar.Item
              icon={RxDashboard}
              active={urlTab === null}
              collapsed="insideCollapse"
              as="div"
            >
              {"Dashboard"}
            </Sidebar.Item>
          </Link>

          <Link to={"/talent-dashboard?tab=profile"}>
            <Sidebar.Item
              icon={HiUser}
              active={urlTab === "profile"}
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Link to={"/talent-dashboard?tab=resources"}>
            <Sidebar.Item
              icon={RiBookOpenFill}
              active={urlTab === "resources"}
              as="div"
            >
              Resources
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>

        {/* Logout Button */}
        {isExpanded ? (
          <div
            className="text-3xl mt-auto text-red-700 cursor-pointer"
            onClick={handleLogout}
          >
            <Tooltip
              content="Sign Out"
              className="w-20"
            >
              <RiLogoutCircleRLine />
            </Tooltip>
          </div>
        ) : (
          <LogoutButton />
        )}
      </Sidebar.Items>
    </Sidebar>
  );
}
