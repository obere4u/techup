import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "flowbite-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { AUTH_API_URL } from "../../../API/Auth";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
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

  const disableNextButton = !watch("email");

  const onSubmit = async (email) => {
    setLoading(true);
    try {
      const forgotPasswordResponse = await axios.post(
        AUTH_API_URL + "/forgot-password",
        email,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        text: forgotPasswordResponse.data.message,
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: "top",
      });

      navigate("/");
    } catch (error) {
      const errorMsg = error.response?.data?.message || error?.message; //change to internal server error
      Swal.fire({
        icon: "error",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
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
      <div className="mx-auto mt-10 py-4 px-1 shadow-md my-6 w-[90%] md:w-[40%]">
        <div className="text-center">
          <h4 className="text-2xl font-semibold">Forgot Password</h4>
          <p>Your password reset link will be sent to your email.</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mt-10 w-[95%]"
        >
          {/* Email field */}
          <div
            className={`flex  flex-col w-full ${
              isSubmitting ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div
              className={`pl-1 flex items-center border-b ${
                touchedFields.email && !errors.email
                  ? "border-green-300 shadow-green-300 shadow-sm"
                  : errors.email && touchedFields.email
                  ? "border-red-300 shadow-red-300 shadow-sm"
                  : "border-gray-300"
              }`}
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
                {...register("email")}
                className={`w-full bg-inherit focus:ring-0  px-2 flex items-center border-b text-[0.8rem] md:text-base `}
              />
            </div>

            <p className="text-red-500 py-[2px] text-sm font-300 italic">
              {errors.email?.message}
            </p>
          </div>

          <Button
            theme={ButtonCustomStyle}
            disabled={disableNextButton}
            type="submit"
            color="blue"
          >
            {loading ? (
              <div className="w-full flex space-x-8 items-center cursor-not-allowed opacity-60">
                <span className="w-full">Sending Link</span>
                <CircularProgress
                  size={20}
                  color={"inherit"}
                />
              </div>
            ) : (
              "Send Link"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
