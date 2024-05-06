import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AUTH_API_URL } from "../../../API/Auth";
import Swal from "sweetalert2";
import { Button } from "flowbite-react";
import {
  adminSignInStart,
  adminSignInSuccess,
  adminSignInFailure,
  adminSignInFinish,
} from "../../../redux/admin/adminSlice";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ADMIN_API_URL } from "../../../API/AdminAPI.JS";

export default function AdminSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailFound, setIsEmailFound] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@#$%^&*+`~'=?|.:;_=^{}/\][()\-<>/]).{6,}$/,
        "Password must contain at least one number, one lowercase case, one uppercase letter, and one special character"
      ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password")],
      "Passwords do not match"
    ),
  });

  // Check if the user is already signed in on component mount
  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (adminToken) {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  });

  const disableButton = isSubmitting || isLoading || !watch("password");
  const disableNextButton = !watch("email");

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const onSubmit = async (data) => {
    try {
      dispatch(adminSignInStart());

      const adminSignInResponse = await axios.post(
        AUTH_API_URL + "/admin/signin",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const adminData = adminSignInResponse.data.userWithoutPassword;

      dispatch(adminSignInSuccess(adminData));

      const { admin_token } = adminSignInResponse.data;

      localStorage.setItem("admin_token", admin_token);

      Swal.fire({
        icon: "success",
        text: "Sign in successful",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: "top",
      });

      navigate("/admin");
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        !error.response.data.passwordExists
      ) {
        setShowConfirmPassword(true);
        setShowPassword(true);
      } else {
        dispatch(adminSignInFailure());

        const errorMsg = error.response?.data?.message || error?.message; //change to internal server error
        Swal.fire({
        icon: "error",
        text: errorMsg,
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: "top",
      });
      }
    } finally {
      dispatch(adminSignInFinish());
    }
  };

  const nextBtn = async (email) => {
    setIsLoading(true);

    try {
      const checkAdminEmailResponse = await axios.get(
        ADMIN_API_URL + "/check-email/" + email
      );

      if (checkAdminEmailResponse.status === 200) {
        setIsLoading(false);
        setIsEmailFound(true);
        setShowPassword(true);

        const adminPasswordCheckResponse = await axios.post(
          AUTH_API_URL + "/admin/check-password",
          { email: email }
        );

        if (adminPasswordCheckResponse.data.passwordExists) {
          setIsLoading(false);
          setIsEmailFound(true);
          setShowPassword(true);
        } else {
          setIsLoading(false);
          setShowPassword(true);
          setShowConfirmPassword(true);
        }
      }
    } catch (error) {
      setIsLoading(false);
      let errorMessage;
      errorMessage = error.response.data.message || error.response.data.message;

      console.log(error);
      Swal.fire({
        icon: "error",
        text:
          errorMessage === "Request failed with status code 500"
            ? "Internal server error"
            : errorMessage,
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
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

  const ButtonCustomStyle = {
    base: `group w-[50%] ${
      isLoading ? "md:w-[60%]" : "md:md:w-[40%]"
    } mx-auto !mt-6 text-[1.08rem] relative flex items-stretch justify-center p-0.5 text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 `,
    size: {
      md: " py-2 text-xl",
    },
    color: {
      blue: "border border-transparent bg-blue-700 text-white focus:ring-4 focus:ring-blue-300 enabled:hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    },
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="flex flex-col mx-auto mt-10 py-4 px-1 shadow-md my-6 w-[90%] md:w-[40%]">
        <h2 className="text-2xl font-semibold text-center">Sign In</h2>
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
          {showPassword && !disableNextButton && (
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

          {((showPassword && isEmailFound) || showConfirmPassword) && (
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
        <br />
        {/*Forgot password*/}
        {showPassword && !showConfirmPassword && (
          <span className="ml-auto p-1 mr-3">
            <Link
              to="/forgot-password"
              className="text-blue-800 font-[500] text-[1.05rem] hover:text-opacity-70"
            >
              Forgot password
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}
