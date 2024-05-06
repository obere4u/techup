import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
import { useDispatch } from "react-redux";

export default function TalentSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailFound, setIsEmailFound] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    reset,
    trigger,
  } = useForm({
    mode: "all",
  });

  const disableButton = isSubmitting || isLoading || !watch("password");
  const disableNextButton = !watch("email");

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  //check email and password existence
  const nextBtn = async (email) => {
    setIsLoading(true);

    try {
      const checkEmailResponse = await axios.get(
        TALENT_API_URL + "/check-email/" + email
      );

      if (checkEmailResponse.status === 200) {
        setIsLoading(false);
        setIsEmailFound(true);
        setShowPassword(true);

        const passwordCheckResponse = await axios.post(
          AUTH_API_URL + "/check-password",
          { email: email }
        );

        if (passwordCheckResponse.data.passwordExists) {
          setIsLoading(false);
          setIsEmailFound(true);
          setShowPassword(true);
        } else {
          setIsLoading(false);
          setShowConfirmPassword(true);
          setShowPassword(true);
        }
      }
    } catch (error) {
      setIsLoading(false);
      const errMsg =
        error.response?.status === 401
          ? error.response?.data
          : error.response?.status === 404
          ? error.response?.data
          : "Network Error";
      console.log("errCod:", error);
      Swal.fire({
        icon: "error",
        text: errMsg,
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

  //login
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
      dispatch(signInFailure());
      const errorMsg =
        error.response?.status === 401
          ? error.response?.data?.message
          : "Network Error";
      console.log("errCod:", error);
      Swal.fire({
        icon: "error",
        text: errorMsg,
      });
    } finally {
      dispatch(signInFinish());
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
      setShowConfirmPassword();
      reset(); // Reset the form
    }
  };

  //watch password
  const password = watch("password");

  useEffect(() => {
    trigger("confirmPassword");
  }, [password, trigger]);


 useEffect(() => {
   if (showConfirmPassword) {
     trigger("password");
   }
 }, [trigger, showConfirmPassword]);
  

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
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address",
                  },
                  onChange: handleEmailChange,
                })}
                aria-invalid={errors.mail ? "true" : "false"}
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
                  {...register("password", {
                    required: "Password is required",
                    ...(showConfirmPassword && {
                      pattern: {
                        value:
                          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@#$%^&*+`~'=?|.:;_=^{}/\][()\-<>/]).{6,}$/,
                        message:
                          "Password must contain at least one digit, one lowercase and one uppercase letter, and one special character",
                      },
                    }),
                  })}

                  onChange={() => {
    trigger("password");
  }}

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
              {showConfirmPassword &&
                errors.password &&
                touchedFields.password && (
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
                  label="showConfirmPassword"
                  placeholder="ekitiState1@"
                  {...register("confirmPassword", {

                    required: "Confirm password is required",
                    validate: (value) => {
                      if (value === watch("password")) {
                        return true; // Passwords match
                      } else {
                        return "Passwords do not match";
                      }
                    },

                  })}
                  className="w-full bg-inherit ring-transparent focus:ring-0 border-none text-[#101010] tracking-wider focus:outline-none "
                />
                <span
                  className="cursor-pointer ml-auto"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisibility ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>

              {errors.confirmPassword && touchedFields.confirmPassword && (
                <p className="text-red-500 py-[2px] text-sm font-300 italic">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          {!isEmailFound && !showPassword && !showConfirmPassword && (
            <Button
              theme={ButtonCustomStyle}
              disabled={disableNextButton}
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
