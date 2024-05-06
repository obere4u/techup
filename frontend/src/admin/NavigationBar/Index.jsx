import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import kinplusLogo from "../../assets/images//kinplus.jpg";
import { IoCheckmarkSharp } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { FaRegHandshake } from "react-icons/fa6";
import { IoIosPeople, IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";

const navLinksItems = [
  {
    name: "Dashboard",
    icon: <RxDashboard />,
    to: "/admin",
  },
  {
    name: "Talents",
    icon: <IoIosPeople />,
    to: "/admin/talents",
  },
  {
    name: "Partners",
    icon: <FaRegHandshake />,
    to: "/admin/partners",
  },
  {
    name: "Selected",
    icon: <IoCheckmarkSharp />,
    to: "/admin/selected",
  },
];

export default function NavigationBar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Loop through the navLinksItems to find the index of the item that matches the current pathname
    const navLinkItemIndex = navLinksItems.findIndex(
      (navLinkItem) => navLinkItem.to === location.pathname
    );
    if (navLinkItemIndex !== -1) {
      setActiveNavLinkIndex(navLinkItemIndex);
    }
  }, [location.pathname]);

  const [activeNavLinkIndex, setActiveNavLinkIndex] = useState(-1);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const variants = {
    expanded: { width: "16%" },
    nonExpanded: { width: "8%" },
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <motion.aside
      animate={isExpanded ? "expanded" : "nonExpanded"}
      variants={variants}
      className={`relative  py-12 flex flex-col border border-r-1  min-h-screen ${
        isExpanded ? "px-10" : "px-4"
      }`}
    >
      <Link
        to="/admin"
        className={isExpanded ? "w-1/2" : ""}
      >
        <img
          src={kinplusLogo}
          alt=""
          className={`w-full ${!isExpanded && "mr-4"}`}
        />
      </Link>

      {/* Toggle sidebar button */}
      <div
        className="w-5 h-5 bg-blue-400 rounded-full absolute -right-[10.5px] top-12 flex items-center justify-center cursor-pointer"
        onClick={toggleSidebar}
      >
        {isExpanded ? (
          <IoIosArrowBack className="text-white font-semibold text-xl" />
        ) : (
          <IoIosArrowForward className="text-white font-semibold text-xl" />
        )}
      </div>

      <div
        className={`mt-9 flex flex-col space-y-10 ${
          !isExpanded && "mt-2 space-y-0"
        }`}
      >
        {navLinksItems.map((navLinkItem, index) => (
          <NavLink
            to={navLinkItem.to}
            exact="true"
            key={index}
            onClick={() => setActiveNavLinkIndex(index)}
            className={`flex items-center space-x-3 p-1 w-fit  hover:text-blue-700 hover:w-fit ${
              activeNavLinkIndex === index ? " text-blue-500 w-fit" : ""
            }`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`${
                !isExpanded && "flex flex-col items-center w-[4.5rem] h-[3.8rem]"
              }`}
            >
              {hoveredIndex === index && !isExpanded && (
                <>
                  <span className="relative text-xs bg-black p-1 rounded text-white">
                    {navLinkItem.name}
                  </span>
                  <IoMdArrowDropdown className="absolute text-4xl text-black mt-2"/>
                </>
              )}
              <span className={`text-3xl ${!isExpanded && "mt-auto"}`}>
                {navLinkItem.icon}
              </span>
            </div>

            <span className={isExpanded ? "text-lg font-semibold" : "hidden"}>
              {navLinkItem.name}
            </span>
          </NavLink>
        ))}
      </div>
    </motion.aside>
  );
}
