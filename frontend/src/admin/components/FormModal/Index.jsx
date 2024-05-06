import { CircularProgress, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { RxCalendar, RxCaretDown } from "react-icons/rx";
import { useForm } from "react-hook-form";
import * as nigerianStates from "nigerian-states-and-lgas";
import { Fragment } from "react";

export default function FormModal({
  formModalOpen,
  handleClose,
  onChange,
  data,
  handleFormSubmit
}) {
  //Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "all",
    defaultValues: data,
  });


  const [haveLaptop, setHaveLaptop] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [haveInternet, setHaveInternet] = useState("");
  const [stateOfResidence, setStateOfResidence] = useState("");
  const [LGAOfResidence, setLGAOfResidence] = useState(data.LGAOfResidence || "");

  // Online state
  const allStatesAndLGAs = nigerianStates.all();

  const disableButton = isSubmitting;
  return (
    <Fragment>
      <Dialog
        open={formModalOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        PaperProps={{
          style: { minWidth: "90vw" },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ textAlign: "center" }}
        >
          {data._id ? "Update Talent" : "Add User"}
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            onChange={onChange}
            className="flex flex-col justify-center items-center mx-auto mt-1 w-[95%]"
          >
            <div className="flex flex-col gap-14 w-[90%] mt-10">
              {/*Full Name and Email field*/}
              <div className="w-full flex flex-col lg:gap-14 space-y-8 lg:space-y-0  lg:flex-row lg:justify-between">
                {/*Full Name field*/}
                <div
                  className={`flex flex-col gap-2 w-full  lg:w-[50%]  ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <label
                      htmlFor="fullName"
                      className="w-[30%]  flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem] "
                    >
                      Full Name <span className="text-[#FF5252] ">*</span>
                    </label>
                    <input
                      className="bg-inherit outline-none w-full  capitalized text-[#101010] tracking-wider"
                      type="text"
                      id="fullName"
                      {...register("fullName", {
                        required: "Full name is required",
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "Full name should contain only alphabets.",
                        },
                        minLength: {
                          value: 3,
                          message:
                            "Full name should have at least 3 characters",
                        },
                      })}
                    />
                  </div>
                  <div className="flex items-center space-x-8 font-300 italic">
                    <small>Surname First</small>
                    {errors.fullName && (
                      <p className="text-red-500  text-sm  ">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/*Email field*/}
                <div
                  className={`flex flex-col w-full  lg:w-[50%]  ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <label
                      htmlFor="email"
                      className="w-[20%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem]"
                    >
                      Email <span className="text-[#FF5252] ">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full bg-inherit outline-none text-[#101010] tracking-wider"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 py-[2px] text-sm font-300 italic">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/*Date of birth and Gender*/}
              <div className="w-full flex flex-col space-y-12 lg:gap-14  lg:space-y-0  lg:flex-row lg:justify-between">
                {/*Gender*/}
                <div
                  className={`flex flex-col gap-2 w-full  lg:w-[50%]  ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="relative flex gap-[8px] border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <label
                      htmlFor="gender"
                      className="w-[23%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem]"
                    >
                      Gender <span className="text-[#FF5252] ">*</span>
                    </label>
                    <div className="relative w-full  bg-inherit">
                      <select
                        id="gender"
                        className=" relative w-full outline-none z-[999] text-[#101010] text-[0.8rem] md:text-[1.15rem] bg-transparent tracking-wider cursor-pointer pl-2 "
                        {...register("gender", {
                          required: "Gender is required",
                        })}
                      >
                        <option value="">Select your gender</option>
                        <option
                          value="female"
                          className="bg-inherit"
                        >
                          Female
                        </option>
                        <option
                          value="male"
                          className="bg-inherit"
                        >
                          Male
                        </option>
                      </select>
                      <div className="absolute h-full top-0 right-0 cursor-pointer ">
                        <RxCaretDown className="text-[1.5rem]" />
                      </div>
                    </div>
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/*Date of birth field*/}
                <div
                  className={`flex flex-col gap-2 w-full  lg:w-[50%]  ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="relative flex  gap-[8px]  border-b border-slate-700">
                    <label
                      htmlFor="dateOfBirth"
                      className="w-[43%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem]"
                    >
                      Date of Birth <span className="text-[#FF5252] ">*</span>
                    </label>
                    <div className="relative w-full  bg-inherit">
                      <input
                        type="date"
                        id="dateOfBirth"
                        max={"2018-12-31"}
                        min={"1945-12-31"}
                        placeholder="mm/dd/yyyy"
                        {...register("dateOfBirth", {
                          required: "Please choose a date",
                        })}
                        className="relative w-full  outline-none  z-[999] text-[#101010] text-[0.8rem] md:text-[1.15rem] bg-transparent tracking-wider cursor-pointer pl-2"
                      />
                      <div className="absolute h-full top-0 right-0 ">
                        <RxCalendar className="text-[1.5rem]" />
                      </div>
                    </div>
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              </div>

              {/*Phone Number and Education qualification field*/}
              <div className="w-full flex flex-col lg:gap-14 space-y-12 lg:space-y-0 lg:flex-row lg:justify-between">
                {/*Phone Number */}
                <div
                  className={`flex flex-col gap-2 w-full  lg:w-[50%]  ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <label
                      htmlFor="phoneNumber"
                      className="w-[60%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem]"
                    >
                      Phone Number<span className="text-[#FF5252] ">*</span>
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                        minLength: {
                          value: 5,
                          message: "Phone number should have at least 5 digits",
                        },
                        pattern: {
                          value: /^\+?[0-9]+$/,
                          message: "Phone Number should contain only numbers",
                        },
                      })}
                      className="w-full bg-inherit outline-none text-[#101010] tracking-wider"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/*Education Qualification*/}
                <div
                  className={`flex flex-col gap-2 w-full  lg:w-[50%]  ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="relative flex justify-center gap-[8px] border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <label
                      htmlFor="educationQualification"
                      className="w-[90%] md:w-full flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.1rem]"
                    >
                      Education Qualification{" "}
                      <span className="text-[#FF5252] ">*</span>
                    </label>
                    <div className="relative w-full  bg-inherit">
                      <select
                        id="educationQualification"
                        className="relative pl-2 w-full  outline-none  z-[999] text-[#101010] text-[0.7rem] md:text-[0.95rem] bg-transparent tracking-wider cursor-pointer "
                        {...register("educationQualification", {
                          required: "Education Qualification is required",
                        })}
                      >
                        <option value="">Select your Qualification</option>
                        <option
                          value="PhD"
                          className="bg-inherit"
                        >
                          PhD
                        </option>
                        <option
                          value="MSc"
                          className="bg-inherit"
                        >
                          Masters
                        </option>
                        <option
                          value="bachelor"
                          className="bg-inherit"
                        >
                          Bachelor
                        </option>
                        <option
                          value="HND"
                          className="bg-inherit"
                        >
                          HND
                        </option>
                        <option
                          value="ND"
                          className="bg-inherit"
                        >
                          ND
                        </option>
                        <option
                          value="NCE"
                          className="bg-inherit"
                        >
                          NCE
                        </option>
                        <option
                          value="undergraduate"
                          className="bg-inherit"
                        >
                          Undergraduate
                        </option>
                        <option
                          value="ssce"
                          className="bg-inherit"
                        >
                          SSCE
                        </option>

                        <option
                          value="others"
                          className="bg-inherit"
                        >
                          others
                        </option>
                      </select>
                      <div className="absolute h-full top-0 right-0 cursor-pointer">
                        <RxCaretDown className="text-[1.5rem]" />
                      </div>
                    </div>
                  </div>
                  {errors.educationQualification && (
                    <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                      {errors.educationQualification.message}
                    </p>
                  )}
                </div>
              </div>

              {/*State and LGA of residence field*/}
              <div className="w-full flex flex-col lg:gap-14 space-y-12 lg:space-y-0 lg:flex-row lg:justify-between">
                {/*State Field*/}
                <div
                  className={`flex flex-col gap-2 w-full  lg:w-[50%]  ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="relative flex  gap-[8px] border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <label
                      htmlFor="stateOfResidence"
                      className="w-[80%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem]"
                    >
                      State Of Residence
                      <span className="text-[#FF5252] ">*</span>
                    </label>
                    <div className="relative w-full  bg-inherit">
                      <select
                        id="stateOfResidence"
                        className="relative w-full  outline-none z-[999] text-[#101010] text-[0.8rem] md:text-[1.15rem] bg-transparent tracking-wider cursor-pointer pl-2"
                        {...register("stateOfResidence", {
                          required: "State Of Residence is required",
                        })}
                        value={stateOfResidence}
                        onChange={(e) => setStateOfResidence(e.target.value)}
                      >
                        <option value="">Select your state</option>
                        {allStatesAndLGAs.map((state, index) => (
                          <option
                            key={index}
                            value={state.state}
                          >
                            {state.state}
                          </option>
                        ))}
                      </select>
                      <div className="absolute h-full top-0 right-0">
                        <RxCaretDown className="text-[1.5rem]" />
                      </div>
                    </div>
                  </div>
                  {errors.stateOfResidence && (
                    <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                      {errors.stateOfResidence.message}
                    </p>
                  )}
                </div>

                {/* LGA field */}
                {(stateOfResidence || data._id) && (
                  <div
                    className={`flex flex-col gap-2 w-full lg:w-[50%]  ${
                      isSubmitting ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <div className=" flex  justify-center gap-[8px] border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                      <label
                        htmlFor="LGAOfResidence"
                        className="w-[80%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem] "
                      >
                        LGA Of Residence
                        <span className="text-[#FF5252] ">*</span>
                      </label>
                      <div className="relative w-full  bg-inherit">
                        <select
                          id="LGAOfResidence"
                          className="relative w-full  outline-none  z-[999] text-[#101010] text-[0.8rem] md:text-[1.15rem] bg-transparent tracking-wider pl-2 cursor-pointer"
                          {...register("LGAOfResidence", {
                            required: "LGA Of Residence is required",
                          })}
                          value={LGAOfResidence}
                          onChange={(e) => setLGAOfResidence(e.target.value)}
                        >
                          <option value="">Select your LGA </option>
                          {allStatesAndLGAs
                            .filter(
                              (stateObj) => stateObj.state === stateOfResidence
                            )
                            .map((stateObj) =>
                              stateObj.lgas.map((lga, index) => (
                                <option
                                  key={index}
                                  value={lga}
                                >
                                  {lga}
                                </option>
                              ))
                            )}
                        </select>
                        <div className="absolute h-full top-0 right-0 cursor-pointer">
                          <RxCaretDown className="text-[1.5rem]" />
                        </div>
                      </div>
                    </div>
                    {errors.LGAOfResidence && (
                      <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                        {errors.LGAOfResidence.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/*Current Address and Portfolio Link field*/}
              <div className="w-full flex flex-col lg:gap-14 space-y-12 lg:space-y-0 lg:flex-row lg:justify-between">
                {/*Current Address*/}
                <div
                  className={`w-full flex flex-col gap-2  ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <label
                      htmlFor="currentAddress"
                      className="w-[52%] md:w-[60%]  flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem] "
                    >
                      Current Address <span className="text-[#FF5252] ">*</span>
                    </label>
                    <input
                      className="bg-inherit outline-none w-full  text-[#101010] tracking-wider text-[0.8rem] md:text-[1.15rem] pl-1"
                      type="text"
                      id="currentAddress"
                      {...register("currentAddress", {
                        required: "Current Address is required",
                        minLength: {
                          value: 3,
                          message:
                            "Current Address should have at least 3 characters",
                        },
                      })}
                    />
                  </div>
                  {errors.currentAddress && (
                    <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                      {errors.currentAddress.message}
                    </p>
                  )}
                </div>

                {/* Portfolio Link field */}
                <div
                  className={`w-full flex flex-col gap-2  ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <label
                      htmlFor="portfolioLink"
                      className="w-[52%] md:w-[45%] lg:w-[40%] xl:w-[35%] 2xl:w-[25%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem] "
                    >
                      Portfolio Link
                    </label>
                    <input
                      className="bg-inherit outline-none w-full  text-[#101010] tracking-wider text-[0.8rem] md:text-[1.15rem] pl-1"
                      type="text"
                      id="portfolioLink"
                      {...register("portfolioLink", {
                        pattern: {
                          value: /^(https?:\/\/)?[^\s.]+[.][^\s]{2,}$/i,
                          message: "Invalid link ",
                        },
                      })}
                    />
                  </div>
                  <div className="flex items-center space-x-8 pt-[2px]  font-300 italic">
                    <small>Optional</small>
                    {errors.portfolioLink && (
                      <p className="text-red-500 text-sm">
                        {errors.portfolioLink.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/*Program Of Choice and Experience Level field*/}
              <div className="w-full flex flex-col lg:gap-14 space-y-12 lg:space-y-0 lg:flex-row lg:justify-between">
                {/*Program Of Choice Field*/}
                <div
                  className={`flex flex-col gap-2 w-full  lg:w-[50%] ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="relative flex justify-center gap-[8px] border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <label
                      htmlFor="programOfChoice"
                      className="w-[70%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.1rem]"
                    >
                      Program Of Choice
                      <span className="text-[#FF5252] ">*</span>
                    </label>
                    <div className="relative w-full  bg-inherit">
                      <select
                        id="programOfChoice"
                        className="relative w-full  outline-none  z-[999] text-[#101010] text-[0.7rem] md:text-[0.95rem] bg-transparent tracking-wider cursor-pointer pl-2"
                        {...register("programOfChoice", {
                          required: "Program Of Choice is required",
                        })}
                      >
                        <option value="">Select your choice program</option>
                        <option
                          value="software/website development"
                          className="bg-inherit"
                        >
                          Software/Website Development
                        </option>
                        <option
                          value="uiux/product design"
                          className="bg-inherit"
                        >
                          UIUX / Product Design
                        </option>

                        <option
                          value="graphics design"
                          className="bg-inherit"
                        >
                          Graphics Design
                        </option>
                        <option
                          value="Videography"
                          className="bg-inherit"
                        >
                          Videography
                        </option>

                        <option
                          value="data analysis and visualization"
                          className="bg-inherit"
                        >
                          Data Analysis and Visualization
                        </option>
                        <option
                          value="cybersecurity"
                          className="bg-inherit"
                        >
                          Cybersecurity
                        </option>
                      </select>
                      <div className="absolute h-full top-0 right-0 cursor-pointer">
                        <RxCaretDown className="text-[1.5rem]" />
                      </div>
                    </div>
                  </div>
                  {errors.programOfChoice && (
                    <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                      {errors.programOfChoice.message}
                    </p>
                  )}
                </div>

                {/*Experience Level field*/}
                <div
                  className={`flex flex-col gap-2 w-full  lg:w-[50%] ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="relative flex justify-center gap-[8px] border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <label
                      htmlFor="experienceLevel"
                      className="w-[55%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.1rem]"
                    >
                      Experience Level
                      <span className="text-[#FF5252] ">*</span>
                    </label>
                    <div className="relative w-full  bg-inherit ">
                      <select
                        id="experienceLevel"
                        className="relative w-full  outline-none  z-[999] text-[#101010] text-[0.75rem] md:text-[0.95rem] bg-transparent tracking-wider cursor-pointer pl-2"
                        {...register("experienceLevel", {
                          required: "Experience level is required",
                        })}
                      >
                        <option value="">Select your experience level</option>
                        <option
                          value="beginner"
                          className="bg-inherit"
                        >
                          Beginner (0 - 1 year)
                        </option>
                        <option
                          value="intermediate"
                          className="bg-inherit"
                        >
                          Intermediate (1 - 4 years)
                        </option>
                        <option
                          value="advanced"
                          className="bg-inherit"
                        >
                          Advanced (5+ years)
                        </option>
                      </select>
                      <div className="absolute h-full top-0 right-0 cursor-pointer">
                        <RxCaretDown className="text-[1.5rem]" />
                      </div>
                    </div>
                  </div>
                  {errors.experienceLevel && (
                    <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                      {errors.experienceLevel.message}
                    </p>
                  )}
                </div>
              </div>

              {/*have Laptop and Internet access field*/}
              <div className="w-full flex flex-col lg:gap-14 space-y-12 lg:space-y-0 lg:flex-row lg:justify-between">
                {/*Have Laptop Field*/}
                <fieldset
                  className={`flex flex-col gap-2 w-full  lg:w-[50%] ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="relative flex items-center gap-[8px] border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <legend className="w-[85%]  flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.13rem]">
                      Do you have a Laptop ?
                      <span className="text-[#FF5252] ">*</span>
                    </legend>
                    <div className="relative   bg-inherit ">
                      {/*Yes / No */}
                      <div className=" flex justify-center items-center space-x-7 md:space-x-14 text-[0.8rem] md:text-[1.18rem]  text-[#101010] tracking-wider -mt-0.5 mr-auto">
                        {/*Yes*/}
                        <div className="flex ml-4 cursor-pointer">
                          <label
                            htmlFor="haveLaptopYes"
                            className="mr-4"
                          >
                            Yes
                          </label>
                          <input
                            className="cursor-pointer"
                            name="haveLaptop"
                            type="radio"
                            id="haveLaptopYes"
                            value="Yes"
                            {...register("haveLaptop", {
                              required: "Please indicate",

                              onChange: (e) => {
                                setHaveLaptop(e.target.value);
                              },
                            })}
                            checked={haveLaptop === "Yes"}
                          />
                        </div>

                        {/*No*/}
                        <div className="flex ml-4 cursor-pointer">
                          <label
                            htmlFor="haveLaptopNo"
                            className="mr-4"
                          >
                            No
                          </label>

                          <input
                            className="cursor-pointer"
                            name="haveLaptop"
                            type="radio"
                            id="haveLaptopNo"
                            value="No"
                            {...register("haveLaptop", {
                              required: "Please indicate",

                              onChange: (e) => {
                                setHaveLaptop(e.target.value);
                              },
                            })}
                            checked={haveLaptop === "No"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {errors.haveLaptop && (
                    <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                      {errors.haveLaptop.message}
                    </p>
                  )}
                </fieldset>

                {/*Have Internet Field*/}
                <fieldset
                  className={`flex flex-col gap-2 w-full lg:w-[50%] ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="relative flex items-center gap-[8px] border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <legend className=" md:w-full flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.13rem]">
                      Do you have Internet access ?
                      <span className="text-[#FF5252] ">*</span>
                    </legend>
                    <div className="relative  bg-inherit ">
                      {/*Yes / No */}
                      <div className="flex justify-center items-center space-x-5 md:space-x-10 text-[0.8rem] md:text-[0.95rem] text-[#101010] tracking-wider -mt-0.5 mr-auto">
                        {/*Yes*/}
                        <div className="flex ml-4 cursor-pointer">
                          <label
                            htmlFor="haveInternetYes"
                            className="mr-4"
                          >
                            Yes
                          </label>
                          <input
                            className="cursor-pointer"
                            name="haveInternet"
                            type="radio"
                            id="haveInternetYes"
                            value="Yes"
                            {...register("haveInternet", {
                              required: "Please indicate",
                              onChange: (e) => {
                                setHaveInternet(e.target.value);
                              },
                            })}
                            checked={haveInternet === "Yes"}
                          />
                        </div>

                        {/*No*/}
                        <div className="flex ml-4 cursor-pointer">
                          <label
                            htmlFor="haveInternetNo"
                            className="mr-4"
                          >
                            No
                          </label>

                          <input
                            className="cursor-pointer"
                            name="haveInternet"
                            type="radio"
                            id="haveInternetNo"
                            {...register("haveInternet", {
                              required: "Please indicate",
                              onChange: (e) => {
                                setHaveInternet(e.target.value);
                              },
                            })}
                            value="No"
                            checked={haveInternet === "No"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {errors.haveInternet && (
                    <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                      {errors.haveInternet.message}
                    </p>
                  )}
                </fieldset>
              </div>

              {/*Submit and Cancel Buttons*/}
              <DialogActions
                style={{ marginLeft: "auto", marginRight: "auto" }}
              >
                <DialogActions>
                  {/* Cancel Button */}
                  <Button
                    onClick={handleClose}
                    color="error"
                    variant="contained"
                  >
                    Cancel
                  </Button>

                  {/* Submit Button */}
                  <Button
                    onClick={handleFormSubmit}
                    autoFocus
                    disabled={disableButton}
                    variant="contained"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2 cursor-not-allowed">
                          {data._id ? "Updating" : "Submitting"}
                        </span>
                        <CircularProgress
                          size={24}
                          color="inherit"
                        />
                      </>
                    ) : (
                      data._id ? "Update" : "Submit"
                    )}
                  </Button>
                </DialogActions>
              </DialogActions>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
