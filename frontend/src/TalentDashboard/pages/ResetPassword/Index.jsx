import { useState } from "react";
import axios from "axios";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";
import { Button } from "flowbite-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { AUTH_API_URL } from "../../../API/Auth";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  //grab the userId and token from param
  const token = params.get("token");
  const id = params.get("id");

  //validation
  const loginSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@#$%^&*+`~'=?|.:;_=^{}/\][()\-<>/]).{6,}$/,
        "Password must contain at least one lowercase and one uppercase letter, and one special character"
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords do not match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  });

  const disableButton =
    isSubmitting ||
    isLoading ||
    !watch("password") ||
    !watch("confirmPassword");

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const requestData = {
        ...data,
        token,
        id,
      };
      const resetPasswordResponse = await axios.post(
        AUTH_API_URL + "/reset-password",
        requestData
      );

      if (resetPasswordResponse.status === 401) {
        setIsLoading(false);
        return Swal.fire({
          icon: "error",
          text: resetPasswordResponse.data,
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: "top",
        });
      }

      if (resetPasswordResponse.status === 200) {
        Swal.fire({
          icon: "success",
          text: resetPasswordResponse.data,
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: "top",
        });
        setIsLoading(false);
        navigate("/talent-signin");
      }
    } catch (error) {
      setIsLoading(false);
      const errorMsg = error.response.data?.message; //change to internal server error
      Swal.fire({
        icon: "error",
        text:
          errorMsg === "Cannot read properties of null (reading 'token')"
            ? "Invalid or expired token"
            : errorMsg,
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

  const ButtonCustomStyle = {
    base: "group md:w-[40%] mx-auto !mt-6 text-[1.08rem] relative flex items-stretch justify-center p-0.5 text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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
        <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-8 justify-center items-center mx-auto mt-10 w-[95%]"
        >
          {/* Password field */}

          <div
            className={`flex flex-col w-full ${
              isSubmitting ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div
              className={`px-1 flex items-center border-b ${
                touchedFields.password && errors.password && !watch("password")
                  ? "border-red-300 shadow-red-300 shadow-sm"
                  : "border-gray-300"
              }`}
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
                placeholder="Password@"
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
            {errors.password && (
              <p className="text-red-500 py-[2px] text-sm font-300 italic">
                {errors.password?.message}
              </p>
            )}
          </div>

          {/* Confirm Password field */}
          <div
            className={`flex flex-col w-full ${
              isSubmitting ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div
              className={`px-1 flex items-center border-b ${
                touchedFields.confirmPassword &&
                !errors.confirmPassword &&
                watch("confirmPassword")
                  ? "border-green-300 shadow-green-300 shadow-sm"
                  : touchedFields.confirmPassword &&
                    errors.confirmPassword &&
                    !watch("confirmPassword")
                  ? "border-red-300 shadow-red-300 shadow-sm"
                  : "border-gray-300"
              }`}
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
                placeholder="ekitiState@"
                {...register("confirmPassword")}
                className={`w-full bg-inherit ring-transparent focus:ring-0 border-none text-[#101010] tracking-wider focus:outline-none text-[0.8rem] md:text-base ${
                  errors.confirmPassword && touchedFields.confirmPassword
                    ? "border-red-500"
                    : "focus:bg-transparent"
                }`}
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

          <Button
            type="submit"
            theme={ButtonCustomStyle}
            disabled={disableButton}
            color="blue"
          >
            {isSubmitting || isLoading ? (
              <div className="flex space-x-8 items-center">
                <span>Processing</span>
                <CircularProgress
                  size={20}
                  color={"inherit"}
                />
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
        <br />
        {/*Forgot password*/}

        <span className="ml-auto p-1 mr-5">
          <Link
            to="/talent-signin"
            className="text-blue-800 font-[500] text-[1.05rem] hover:text-opacity-70"
          >
            Sign in
          </Link>
        </span>
      </div>
    </div>
  );
}
