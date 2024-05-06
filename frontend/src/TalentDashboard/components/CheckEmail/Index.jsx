import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { TALENT_API_URL } from "../../../API/talentAPI";
import { AUTH_API_URL } from "../../../API/Auth";
import Swal from "sweetalert2";
import { Button } from "flowbite-react";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  signInFinish,
} from "../../../redux/user/userSlice";
import {
  passwordExistStart,
  passwordExistSuccess,
  passwordExistFailure,
} from "../../../redux/passwordExist/passwordExistSlice";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export default function CheckEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailFound, setIsEmailFound] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const loginSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password: Yup.string().when("showConfirmPassword", {
      is: true,
      then: (loginSchema) => loginSchema.required("Password is required")
      .min(6, "Password must be at least 6 characters long")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@#$%^&*+`~'=?|.:;_=^{}/\][()\-<>/]).{6,}$/,
        "Password must contain at least one digit, one lowercase and one uppercase letter, and one special character"
      ),
      otherwise: (loginSchema) => loginSchema.notRequired()
    }),
      
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password")],
      "Passwords do not match"
    ),
  });

  // console.log("passwordExistYes: ", passwordExistYes)

  const onSubmit = async (data) => {
    try {
      dispatch(signInStart());

      const userSignInResponse = await axios.post(
        AUTH_API_URL + "/signin",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const userData = userSignInResponse.data.userWithoutPassword;

      dispatch(signInSuccess(userData));

      const { access_token } = userSignInResponse.data;

      localStorage.setItem("access_token", access_token);

      Swal.fire({
        icon: "success",
        text: "Sign in successful",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: "top",
      });

      navigate("/talent-dashboard");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        !error.response.data.passwordExists
      ) {
        setShowPassword(true);
        setShowConfirmPassword(true);
      } else {
        dispatch(signInFailure());

        const errorMsg = error.response?.data?.message || error?.message; //change to internal server error
        Swal.fire({
          icon: "error",
          text: errorMsg,
        });
      }
    } finally {
      dispatch(signInFinish());
    }
  };

  // Check if the user is already signed in on component mount
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      navigate("/talent-dashboard");
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    watch,
    reset
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  });

  const disableButton = isSubmitting || isLoading || !watch("password");
  const disableNextButton = !watch("email");

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const nextBtn = async (email) => {
    setIsLoading(true);
    dispatch(passwordExistStart());
    try {
      // Perform API call to check email
      const response = await axios.get(TALENT_API_URL + "/check-email/" + email);
      if (response.status === 200) {
        // Update Redux state with password existence status
        dispatch(passwordExistSuccess(response.data.passwordExists));
        // If password exists, hide the password field
        if (response.data.passwordExists) {
          setShowPassword(false);
          setShowConfirmPassword(false);
        } else {
          setShowPassword(true);
          setShowConfirmPassword(true);
        }
      }
    } catch (error) {
      dispatch(passwordExistFailure(error.message));
    }
  };

  const ButtonCustomStyle = {
    base: `group   ${
      isLoading || isSubmitting ? "w-[50%]" : "w-[20%]"
    } mx-auto !mt-6 text-[1.08rem] relative flex items-stretch justify-center p-0.5 text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 `,
    size: {
      md: " py-2 text-xl",
    },
    color: {
      blue: "border border-transparent bg-blue-700 text-white focus:ring-4 focus:ring-blue-300 enabled:hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    },
  };

   // Reset state and form when a new email is entered
  const handleEmailChange = () => {
    if (isEmailFound) {
      setIsEmailFound(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      reset(); // Reset the form
    }
  };


  return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 justify-center items-center mx-auto mt-10 w-[95%]"
      >
        {/* Email field */}
        <div
          className={`flex  flex-col w-full ${
            isSubmitting ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div
            className={`px-1 flex items-center border-b ${
              touchedFields.email && !errors.email && isEmailFound
                ? "border-green-300 shadow-green-300 shadow-sm"
                : errors.email && touchedFields.email
                ? "border-red-300 shadow-red-300 shadow-sm"
                : "border-gray-300"
            } `}
          >
            <label
              htmlFor="email"
              className="w-fit flex z-50 leading-[125%] text-[0.8rem] md:text-[1.18rem]"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              autoComplete="on"
              {...register("email", { onChange: handleEmailChange })}
              className="w-full text-[0.8rem] md:text-base bg-inherit ring-transparent focus:ring-0 border-none text-[#101010] tracking-wider focus:outline-none focus:bg-inherit"
            />
          </div>

          <p className="text-red-500 py-[2px] text-sm font-300 italic">
            {errors.email?.message}
          </p>
        </div>

        {/* Password field */}
        { !disableNextButton && isEmailFound &&(
          <div
            className={`flex flex-col w-full ${
              isSubmitting ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div
              className={`px-1 flex items-center border-b ${
                touchedFields.password &&
                !errors.password &&
                showConfirmPassword
                  ? "border-green-300 shadow-green-300 shadow-sm"
                  : errors.password &&
                    touchedFields.password &&
                    showConfirmPassword &&
                    !watch("password")
                  ? "border-red-300 shadow-red-300 shadow-sm"
                  : "border-gray-300"
              } `}
            >
              <label
                htmlFor="password"
                className="w-fit flex z-50 leading-[125%] text-[0.8rem] md:text-[1.18rem]"
              >
                Password:
              </label>
              <input
                type={passwordVisibility ? "text" : "password"}
                id="password"
                placeholder="ekitiState1@"
                {...register("password")}
                className={`w-full bg-inherit ring-transparent focus:ring-0 border-none text-[#101010] tracking-wider focus:outline-none text-[0.8rem] md:text-base ${
                  errors.password && touchedFields.password
                    ? "border-red-500"
                    : "focus:bg-transparent"
                }`}
              />
              <span
                className="cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisibility ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            {showConfirmPassword && errors.password && (
              <p className="text-red-500 py-[2px] text-sm font-300 italic">
                {errors.password?.message}
              </p>
            )}
          </div>
        )}

        {/* Confirm Password field */}
        {showConfirmPassword && (
          <div
            className={`flex flex-col w-full ${
              isSubmitting ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div
              className={`px-1 flex items-center border-b ${
                touchedFields.confirmPassword && !errors.confirmPassword
                  ? "border-green-300  shadow-sm shadow-green-300"
                  : errors.confirmPassword && touchedFields.confirmPassword
                  ? "border-red-300 shadow-red-300 shadow-sm"
                  : "border-gray-300"
              } text-[0.8rem] md:text-[1.15rem]`}
            >
              <label
                htmlFor="confirmPassword"
                className="w-[70%] lg:w-[55%]  z-50  text-[0.8rem] md:text-[1.18rem]"
              >
                Confirm Password:
              </label>
              <input
                type={passwordVisibility ? "text" : "password"}
                id="confirmPassword"
                placeholder="ekitiState1@"
                {...register("confirmPassword")}
                className="w-full bg-inherit ring-transparent focus:ring-0 border-none text-[#101010] tracking-wider focus:outline-none "
              />
              <span
                className="cursor-pointer ml-auto"
                onClick={togglePasswordVisibility}
              >
                {passwordVisibility ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <p className="text-red-500 py-[2px] text-sm font-300 italic">
              {errors.confirmPassword?.message}
            </p>
          </div>
        )}

        {!isEmailFound && !showPassword && !showConfirmPassword && (
          <Button
            theme={ButtonCustomStyle}
            disabled={disableNextButton}
            type="submit"
            color="blue"
            onClick={() => nextBtn(watch("email"))}
          >
            {isLoading ? (
              <div className="w-full flex space-x-8 items-center cursor-not-allowed opacity-60">
                <span className="w-full ">Checking Email</span>
                <CircularProgress
                  size={20}
                  color={"inherit"}
                />
              </div>
            ) : (
              "Next"
            )}
          </Button>
        )}

        { showConfirmPassword && (
          <Button
            type="submit"
            theme={ButtonCustomStyle}
            disabled={disableButton}
            color="blue"
          >
            {isSubmitting ? (
              <div className="flex space-x-8 items-center">
                <span>Processing</span>
                <CircularProgress
                  size={20}
                  color={"inherit"}
                />
              </div>
            ) : (
              "Login"
            )}
          </Button>
        )}
      </form>
  );
}
