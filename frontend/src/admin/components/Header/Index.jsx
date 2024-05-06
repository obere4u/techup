import { useEffect, useState } from "react";
import { format, getDay, getHours, getMinutes } from "date-fns";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import avatarPlaceHolder from "../../../assets/images/man_avatar_place_holder.jpg";
import Swal from "sweetalert2";

export default function Header() {
  const [daysOfWeek, setDaysOfWeek] = useState("");
  const currentDate = new Date();
  const formattedDate = format(currentDate, "MMMM do, yyyy");

  // auth
  const [login, setLogin] = useState(false);
  const [logout, setLogout] = useState(false);

  const currentTimeHour = getHours(currentDate).toString().padStart(2, "0");
  const currentTimeMinutes = getMinutes(currentDate)
    .toString()
    .padStart(2, "0");
  const navigate = useNavigate()
  
  // set days of week
  useEffect(() => {
    const dayOfWeek = getDay(currentDate);
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
  }, [currentDate]);

  // handle login and logout
  function handleLoginAndLogout() {
    if (!login) {
      setLogin(true);
    } else {
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
      }).then((result) => {
        if (result.isConfirmed) {
          setLogin(false);
          navigate("/admin");
        }
      });
    }
  }

  return (
    <div className="flex justify-between border-b pb-10 px-8">
      <div className="flex space-x-2">
        <span>{daysOfWeek}</span>
        <span>{formattedDate}</span>
        <div>
          <span>{currentTimeHour}</span> : <span>{currentTimeMinutes}</span>
        </div>
      </div>
      <div>
        {/* Admin details */}
        <div className="flex space-x-8">
          {login && (
            <div className="flex space-x-3 items-center">
              <div className="rounded-full w-8 ">
                <img
                  src={avatarPlaceHolder}
                  alt=""
                  className="rounded-full "
                />
              </div>
              <span>Nwosa Tochi</span>
            </div>
          )}

          {/* login or logout btn */}
          <button
            className={` px-6 py-2 rounded-md text-white font-semibold hover:bg-opacity-85 transition duration-150 ease-in-out ${
              !login ? "bg-blue-500" : "bg-red-500"
            } `}
            onClick={handleLoginAndLogout}
          >
            {login ? "Logout" : " Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
