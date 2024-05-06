import {
  Button,
  Label,
  Select,
  Spinner,
  TextInput,
  Tooltip,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { TALENT_API_URL } from "../../../API/talentAPI";
import Swal from "sweetalert2";
import { FaPencil } from "react-icons/fa6";
import { LiaTimesSolid } from "react-icons/lia";
import {
  updateSuccess,
  updateFailure,
  updateStart,
  updateFinish,
} from "../../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export default function Profile() {
  const { currentUser } = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ currentUser });
  const [updating, setUpdating] = useState(false);
  const currentUserId = currentUser?._id;
  const access_token = localStorage.getItem("access_token");
  const [updatePassword, setUpdatePassword] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [editDetails, setEditDetails] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [programOfChoiceEditable, setProgramOfChoiceEditable] = useState(false);

  //disable program of choice
  useEffect(() => {
    const oneWeekTimer = setTimeout(() => {
      setProgramOfChoiceEditable(true);
    }, 604800000); // One week in milliseconds
    // console.log("one week: ", oneWeekTimer);
    return () => clearTimeout(oneWeekTimer);
  }, []);

  const handleFormDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setPasswordChanged(true);
  };

  //user edit details start
  const handleUpdateClick = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // Dispatch updateStart action here if you're using Redux
      if (Object.keys(formData).length === 0) {
        return;
      }
      dispatch(updateStart());
      const updateResponse = await axios.put(
        TALENT_API_URL + `/update/${currentUserId}`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Check if the response is successful
      if (updateResponse.status === 200) {
        setEditDetails(false);
        dispatch(updateSuccess(updateResponse.data));
        Swal.fire({
          icon: "success",
          text: "Profile updated successfully",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: "top",
        });
      } else {
        dispatch(updateFailure());
        const errorMsg = updateResponse.res?.data?.message;
        console.log("msg: ", errorMsg);
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
    } catch (error) {
      console.log(error);
      dispatch(updateFailure());
      Swal.fire({
        icon: "error",
        text: "An error occurred while updating profile",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: "top",
      });
    } finally {
      dispatch(updateFinish());
      setUpdating(false);
    }
  };

  const handleEditDetails = () => {
    setEditDetails(true);
  };

  const handleCancelEditDetails = () => {
    // Reset the formData state to the currentUser data
    setFormData({ currentUser });
    // Reset the passwordChanged state
    setPasswordChanged(false);

    // Exit the edit mode
    setEditDetails(false);
  };

  const disableOtherFields = !editDetails || updating;
  const disablePasswordField = !editPassword || updating;

  //user edit details ends

  const ButtonCustomStyle = {
    base: `group md:w-[40%] ${
      updating && "md:w-[60%]"
    } mx-auto !mt-12 text-[1.08rem] relative flex items-stretch justify-center p-0.5 text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
    size: {
      md: "px-3 py-2 text-xl",
    },
    color: {
      blue: "border border-transparent bg-blue-700 text-white focus:ring-4 focus:ring-blue-300 enabled:hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    },
  };

  const textInputCustomStyle = {
    base: "w-full flex ",
    field: {
      base: "relative w-full",
      input: {
        base: "block bg-black font-semibold text-[1.05rem] w-full  disabled:cursor-not-allowed disabled:opacity-40 border-gray-300",
      },
    },
  };

  //password edit starts
  const loginSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[!@#$%^&*+`~'=?|.:;_=^{}/\][()\-<>/]).{6,}$/,
        "Password must contain at least one lowercase and one uppercase letter, and one special character"
      ),
  });
  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "all",
    resolver: yupResolver(loginSchema),
  });

  const handleEditPassword = () => {
    updatePassword
      ? setEditPassword(false)
      : setEditPassword((prevState) => !prevState);
  };

  //disable password
  const disabledPasswordField = !editPassword || updatePassword;

  //update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setUpdatePassword(true);
    setPasswordChanged(true);

    try {
      if (Object.keys(formData).length === 0) {
        return;
      }
      // Dispatch updateStart action here if you're using Redux
      dispatch(updateStart());
      const updateResponse = await axios.put(
        TALENT_API_URL + `/update/${currentUserId}`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Check if the response is successful
      if (updateResponse.status === 200) {
        setUpdatePassword(false);
        setEditPassword(false);
        dispatch(updateSuccess(updateResponse.data));
        Swal.fire({
          icon: "success",
          text: "Successfully changed password",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: "top",
        });
      } else {
        setUpdatePassword(false);
        dispatch(updateFailure());
        const errorMsg = updateResponse.res?.data?.message;
        console.log("msg: ", errorMsg);
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
    } catch (error) {
      setUpdatePassword(false);
      console.log(error);
      //  const errorMsg = data?.message;
      //  console.log("msg: ", errorMsg);
      dispatch(updateFailure());
      Swal.fire({
        icon: "error",
        text: "An error occurred while updating password",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: "top",
      });
    } finally {
      setUpdatePassword(false);
      dispatch(updateFinish());
    }
  };

  useEffect(() => {
    return () => {
      resetPasswordFields();
    };
  }, [updatePassword]);

  const resetPasswordFields = () => {
    setPasswordChanged(false);
  };

  //show password in plain text
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  //password edit details ends

  return (
    <div className="h-full mt-10 p-3 md:w-[80%] mx-auto space-y-4 flex flex-col items-center">
      <div className="flex items-center">
        <h1 className="flex text-3xl font-semibold text-center">Profile </h1>
        <span className="text-xl">
          {" "}
          {!editDetails ? (
            <Tooltip content="Edit Details">
              <div
                onClick={handleEditDetails}
                className="!ml-4 border-b-2 border-blue-600 flex space-x-1 items-center cursor-pointer"
              >
                <span>edit</span>
                <FaPencil className=" text-xl " />
              </div>
            </Tooltip>
          ) : (
            <div
              onClick={handleCancelEditDetails}
              className="!ml-4 border-b-2 border-blue-600 flex space-x-1 items-center cursor-pointer"
            >
              <span>edit</span>
              <LiaTimesSolid className=" text-xl " />
            </div>
          )}
        </span>
      </div>
      {/* Fields */}

      <form
        onSubmit={handleUpdateClick}
        className="lg:w-[50%] flex flex-col space-y-5"
      >
        {/* Change Image */}
        {/*<input
          type="file"
          id="image.url"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
  />*/}
        {/* Put image here and also on click of image, it opens the file input */}
        {/*<div
          className="w-32 h-32 cursor-pointer self-center shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={previewImage}
            alt=""
            className="rounded-full w-full h-full border-8 border-[lightgrey] object-cover"
          />
  </div>*/}
        {/* Full Name */}
        <div className="w-full flex items-center space-x-2">
          <Label
            htmlFor="fullName"
            value="Full Name :"
            className="w-[40%] font-normal "
          />
          <TextInput
            theme={textInputCustomStyle}
            type="text"
            id="fullName"
            defaultValue={currentUser.fullName}
            onChange={handleFormDataChange}
            disabled={disableOtherFields}
          />
        </div>

        {/* Gender */}
        <div className="w-full flex items-center space-x-2">
          <Label
            htmlFor="gender"
            value="Gender :"
            className="w-[30%] font-normal "
          />
          <TextInput
            type="text"
            id="gender"
            theme={textInputCustomStyle}
            placeholder="Gender"
            defaultValue={currentUser.gender}
            onChange={handleFormDataChange}
            className="w-full"
            disabled={disableOtherFields}
          />
        </div>

        {/* Email */}
        <div className="w-full flex items-center space-x-2">
          <Label
            htmlFor="email"
            value="Email :"
            className="w-[20%] font-normal "
          />
          <TextInput
            type="text"
            id="email"
            theme={textInputCustomStyle}
            placeholder="Email"
            defaultValue={currentUser.email}
            onChange={handleFormDataChange}
            className="w-full"
            disabled={disableOtherFields}
          />
        </div>

        {/* Date of Birth */}
        <div className="w-full flex items-center space-x-2">
          <Label
            htmlFor="dateOfBirth"
            value="Date of Birth :"
            className="w-[50%] font-normal "
          />
          <TextInput
            type="date"
            id="dateOfBirth"
            theme={textInputCustomStyle}
            placeholder="Date of Birth"
            defaultValue={currentUser.dateOfBirth}
            onChange={handleFormDataChange}
            className="w-full"
            disabled={disableOtherFields}
          />
        </div>

        {/* Phone Number */}
        <div className="w-full flex items-center space-x-2">
          <Label
            htmlFor="phoneNumber"
            value="Phone Number :"
            className="w-[55%] font-normal "
          />
          <TextInput
            type="text"
            id="phoneNumber"
            theme={textInputCustomStyle}
            placeholder="Phone Number"
            defaultValue={currentUser.phoneNumber}
            onChange={handleFormDataChange}
            className="w-full"
            disabled={disableOtherFields}
          />
        </div>

        {/* Program Of Choice */}
        <div className="w-full flex items-center space-x-2">
          <Label
            htmlFor="programOfChoice"
            value="Program Of Choice :"
            className="w-[80%] font-normal "
          />
          <Select
            id="programOfChoice"
            theme={textInputCustomStyle}
            placeholder="Program Of Choice"
            defaultValue={currentUser.programOfChoice}
            onChange={handleFormDataChange}

            disabled

            className="w-full"
          >
            <option>Graphics Design</option>
            <option>UiUx/Product Design</option>
            <option>Software/Website Development</option>
            <option>Cybersecurity</option>
            <option>Data Analysis/Visualization</option>
            <option>Videography</option>
            <option>PackageJs</option>
          </Select>
        </div>

        {/* State Of Residence */}
        <div className="w-full flex items-center space-x-2">
          <Label
            htmlFor="stateOfResidence"
            value="State Of Residence :"
            className="w-[80%] font-normal "
          />
          <TextInput
            type="text"
            id="stateOfResidence"
            theme={textInputCustomStyle}
            placeholder="State Of Residence"
            defaultValue={currentUser.stateOfResidence}
            onChange={handleFormDataChange}
            className="w-full"
            disabled={disableOtherFields}
          />
        </div>

        {/* LGA Of Residence */}
        <div className="w-full flex items-center space-x-2">
          <Label
            htmlFor="LGAOfResidence"
            value="LGA Of Residence :"
            className="w-[80%] font-normal "
          />
          <TextInput
            type="text"
            theme={textInputCustomStyle}
            id="LGAOfResidence"
            placeholder="LGA Of Residence"
            defaultValue={currentUser.LGAOfResidence}
            onChange={handleFormDataChange}
            disabled={disableOtherFields}
          />
        </div>

        {/* Current Address */}
        <div className="w-full flex items-center space-x-2">
          <Label
            htmlFor="currentAddress"
            value="Current Address :"
            className="w-[80%] font-normal "
          />
          <TextInput
            type="text"
            id="currentAddress"
            theme={textInputCustomStyle}
            placeholder="Current Address"
            defaultValue={currentUser.currentAddress}
            onChange={handleFormDataChange}
            disabled={disableOtherFields}
          />
        </div>

        {/* Button for other details */}
        <Button
          type="submit"
          color={"blue"}
          theme={ButtonCustomStyle}
          disabled={disableOtherFields}
        >
          {updating ? (
            <div className="flex items-center space-x-4">
              <span>Updating</span>
              <Spinner
                aria-label="Spinner button example"
                size="sm"
              />
            </div>
          ) : (
            "Update"
          )}
        </Button>
      </form>

      {/*Password updating*/}
      <form
        onSubmit={handlePasswordUpdate}
        className="lg:w-[50%] flex flex-col space-y-5"
      >
        {/* Password field */}
        <h2 className="text-xl !mt-12 text-center font-semibold">
          Update Password
        </h2>
        {/* Password */}
        <div
          className={`flex flex-col w-full ${
            isSubmitting ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="flex items-center">
            <div className="w-full flex items-center border-b border-slate-700 text-[0.8rem] md:text-[1.15rem]">
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
                disabled={disablePasswordField}
                className={`w-full bg-inherit ring-transparent focus:ring-0 border-none text-[#101010] tracking-wider focus:outline-none focus:bg-transparent ${
                  disablePasswordField
                    ? "cursor-not-allowed text-slate-100 bg-slate-100"
                    : ""
                }`}
              />
              <span
                className="cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisibility ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            <span className="ml-auto">
              {!editPassword ? (
                <FaPencil
                  onClick={handleEditPassword}
                  className="cursor-pointer text-xl !ml-4"
                />
              ) : (
                <LiaTimesSolid
                  onClick={handleEditPassword}
                  className="cursor-pointer text-xl !ml-4"
                />
              )}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 py-[2px] text-sm font-300 italic">
              {errors.password.message}
            </p>
          )}
        </div>

        {editPassword && (
          <Button
            type="submit"
            color={"blue"}
            theme={ButtonCustomStyle}
            disabled={disabledPasswordField}
            onClick={handlePasswordUpdate}
          >
            {updatePassword ? (
              <div className="flex items-center space-x-4">
                <span>Processing</span>
                <Spinner
                  aria-label="Spinner button example"
                  size="sm"
                />
              </div>
            ) : (
              "Update password"
            )}
          </Button>
        )}
      </form>
    </div>
  );
}
