import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AUTH_API_URL } from "../../../API/Auth";
import axios from "axios";
import { signOutSuccess } from "../../../redux/user/userSlice.js";
import { useDispatch } from "react-redux";

export default function LogoutButton() {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
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

  const ButtonCustomStyle = {
    base: "group w-full text-2xl mt-auto relative flex items-stretch justify-center p-0.5 text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none",
    size: {
      md: "px-4 py-2 text-xl",
    },
  };

  return (
    <Button
      color="failure"
      onClick={handleLogout}
      theme={ButtonCustomStyle}
      className=" "
    >
      Sign out
    </Button>
  );
}
