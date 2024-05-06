import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { TbCurrencyNaira } from "react-icons/tb";
import { RxCaretDown } from "react-icons/rx";
import Spinner from "../../../utils/Spinner/Index";
import { useLocation, useNavigate } from "react-router-dom";
// import { DONORS_API_URL } from "../../../utils/API/donorAPI"; //Dev API
import Swal from "sweetalert2";
import axios from "axios";
import { PARTNERS_API_URL } from "../../../../API/partnerAPI.js"; //Prod API
import PayButton from "../../../utils/Paystack/Index";
import ClientLayout from "../../../utils/ClientLayout/Index";
import "./style.css";

export default function PartnerForm() {
  const [fullName, setFullName] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [comment, setComment] = useState("");
  const [partnershipType, setPartnershipType] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [organizationWebsite, setOrganizationWebsite] = useState("");

  //convert amount
  const paystackAmount = (amount * 100).toString();
  //Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "all",
  });

  //navigate and location of path
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data) => {
    //checks if partnershipType is placement
    if (partnershipType === "placement organization") {
      try {
        const response = await axios.post(PARTNERS_API_URL, data);

        // if successful (status code 201)
        navigate("/thank-you", { state: { from: location } });

        console.log(response);
        reset();
      } catch (error) {
        const errorMessage = error.response;

        console.error("An error occurred:", errorMessage);

        // Display error message using Swal
        Swal.fire({
          icon: "error",
          text: "Something went wrong!, Please Try again...",
        });
      }
    }
  };

  //Reset Form
  useEffect(() => {
    reset();
  }, [reset]);

  //DisableButton
  const disableButton = isSubmitting;

  return (
    <ClientLayout>
      <section className="mx-auto w-full ">
        {/*Partner Form*/}
        <div className="text-[#101010] text-opacity-60 md:ml-0  pl-1">
          <p className="text-center py-3 text-[0.8rem] md:text-[1.15rem] font-semibold text-[#101010]">
            All fields marked <span className="text-[#FF5252] ">*</span> are
            important for Partners and Sponsors
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center items-center mx-auto mt-1 mb-4 w-[95%]"
          >
            <div className="flex flex-col gap-14 w-[90%] items-center justify-center mt-10">
              {/*Full Name field*/}
              <div
                className={`flex flex-col  w-full md:w-[70%] lg:w-[60%]  ${
                  isSubmitting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex border-b items-center border-slate-700 text-[0.8rem] md:text-[1.15rem]">
                  <label
                    htmlFor="fullName"
                    className="w-[35%] md:w-[20%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem] "
                  >
                    Full Name <span className="text-[#FF5252] ">*</span>
                  </label>
                  <input
                    className="bg-inherit w-full  focus:ring-0 appearance-none outline-none  capitalized text-[#101010] tracking-wider"
                    type="text"
                    id="fullName"
                    aria-required="true"
                    {...register("fullName", {
                      required: "Full Name is required",
                      onChange: (e) => {
                        setFullName(e.target.value);
                      },

                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: "Full name should contain only characters.",
                      },
                    })}
                  />
                </div>
                <div className="flex items-center space-x-2 font-300 italic">
                  <small>Surname First</small>
                  {errors.fullName && (
                    <p className="text-red-500 text-[0.5rem] md:text-sm justify-self-center">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
              </div>

              {/*Email field*/}
              <div
                className={`flex flex-col w-full md:w-[70%] lg:w-[60%]  ${
                  isSubmitting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex border-b items-center border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                  <label
                    htmlFor="email"
                    className="w-[18%] md:w-[10%]  flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem]"
                  >
                    Email <span className="text-[#FF5252] ">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    aria-required="true"
                    {...register("email", {
                      required: "Email is required",

                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                        message: "Invalid email address",
                      },
                      onChange: (e) => {
                        setEmail(e.target.value);
                      },
                    })}
                    className="w-full bg-inherit text-[#101010] tracking-wider  focus:ring-0 appearance-none outline-none "
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 py-[2px] text-[0.5rem] md:text-sm font-300 italic">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/*Phone Number */}
              <div
                className={`flex flex-col  w-full md:w-[70%] lg:w-[60%]  ${
                  isSubmitting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex border-b items-center border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                  <label
                    htmlFor="phone"
                    className="w-[50%] md:w-[30%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem]"
                  >
                    Phone Number<span className="text-[#FF5252] ">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    aria-required="true"
                    {...register("phone", {
                      required: "Phone Number is required",
                      minLength: {
                        value: 5,
                        message: "Phone Number should have at least 5 digits",
                      },
                      pattern: {
                        value: /^\+?[0-9]+$/,
                        message: "Phone Number should contain only numbers",
                      },
                      onChange: (event) => {
                        setPhone(event.target.value);
                      },
                    })}
                    className="w-full bg-inherit text-[#101010] tracking-wider  focus:ring-0 appearance-none outline-none "
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 pt-[2px] text-[0.5rem] md:text-sm font-300 italic">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/*Current Address field*/}
              <div
                className={`flex flex-col  w-full md:w-[70%] lg:w-[60%]  ${
                  isSubmitting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex border-b items-center border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                  <label
                    htmlFor="currentAddress"
                    className="w-[55%] md:w-[30%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem] "
                  >
                    Current Address <span className="text-[#FF5252] ">*</span>
                  </label>
                  <input
                    className="bg-inherit  w-full  focus:ring-0 appearance-none outline-none  text-[#101010] tracking-wider text-[0.8rem] md:text-[1.15rem] pl-1"
                    type="text"
                    id="currentAddress"
                    aria-required="true"
                    {...register("currentAddress", {
                      required: "Current Address is required",
                      minLength: {
                        value: 3,
                        message:
                          "Current Address should have at least 3 characters",
                      },

                      onChange: (event) => {
                        setCurrentAddress(event.target.value);
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

              {/*partnershipType*/}
              <div
                className={`flex flex-col  w-full md:w-[70%] lg:w-[60%]  ${
                  isSubmitting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="relative flex gap-[8px] border-b border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                  <label
                    htmlFor="partnershipType"
                    className="w-[60%] lg:w-[30%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem]"
                  >
                    Partnership type <span className="text-[#FF5252] ">*</span>
                  </label>
                  <div className="relative w-full  bg-inherit">
                    <select
                      id="partnershipType"
                      className=" relative w-full z-[999] text-[#101010] text-[0.8rem] md:text-[1.15rem] bg-transparent tracking-wider cursor-pointer pl-2  focus:ring-0 !appearance-none outline-none !marker:hidden !marker:appearance-none "
                      {...register("partnershipType", {
                        required: "Partnership Type is required",
                        onChange: (event) => {
                          setPartnershipType(event.target.value);
                        },
                      })}
                    >
                      <option value="">Select partnership type</option>
                      <option
                        value="monetary donation"
                        className="bg-inherit"
                      >
                        Monetary Donation
                      </option>
                      <option
                        value="placement organization"
                        className="bg-inherit"
                      >
                        Placement Organization
                      </option>
                      <option
                        value="both"
                        className="bg-inherit"
                      >
                        Both
                      </option>
                    </select>
                    <div className="absolute h-full top-0 right-0 cursor-pointer ">
                      <RxCaretDown className="text-[1.5rem]" />
                    </div>
                  </div>
                </div>
                {errors.partnershipType && (
                  <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                    {errors.partnershipType.message}
                  </p>
                )}
              </div>

              {/*Amount field*/}
              {partnershipType === "monetary donation" ||
              partnershipType === "both" ? (
                <div
                  className={`flex flex-col  w-full md:w-[70%] lg:w-[60%]  ${
                    isSubmitting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex border-b items-center border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                    <label
                      htmlFor="amount"
                      className="w-[90%] md:w-[50%]  z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem] flex items-center"
                    >
                      Amount to donate (<TbCurrencyNaira />)
                      <span className="text-[#FF5252] ">*</span>
                    </label>
                    <input
                      className="bg-inherit  w-full  focus:ring-0 appearance-none outline-none  text-[#101010] tracking-wider text-[0.8rem] md:text-[1.15rem] pl-1"
                      type="text"
                      id="amount"
                      aria-required="true"
                      {...register("amount", {
                        required: "Amount is required",

                        onChange: (event) => {
                          setAmount(event.target.value);
                        },
                      })}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              ) : (
                ""
              )}

              {/*Organization Name field*/}
              <div
                className={`flex flex-col  w-full md:w-[70%] lg:w-[60%]  ${
                  isSubmitting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex border-b items-center border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                  <label
                    htmlFor="organizationName"
                    className="w-[55%] md:w-[40%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem] "
                  >
                    Organization Name
                    {partnershipType === "placement organization" ||
                    partnershipType === "both" ? (
                      <span className="text-[#FF5252] ">*</span>
                    ) : (
                      ""
                    )}
                  </label>
                  <input
                    className="bg-inherit w-full  focus:ring-0 appearance-none outline-none  text-[#101010] tracking-wider text-[0.8rem] md:text-[1.15rem] pl-1"
                    type="text"
                    id="organizationName"
                    aria-required="true"
                    {...register("organizationName", {
                      required: "Organization Name is required",

                      onChange: (event) => {
                        setOrganizationName(event.target.value);
                      },
                    })}
                  />
                </div>
                <div className="flex items-center space-x-2 font-300 italic">
                  {partnershipType === "monetary donation" ? (
                    <small>Optional</small>
                  ) : (
                    ""
                  )}
                  {partnershipType !== "monetary donation" && (
                    <div>
                      {errors.organizationName && (
                        <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                          {errors.organizationName.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/*Organization Address field*/}
              <div
                className={`flex flex-col  w-full md:w-[70%] lg:w-[60%]  ${
                  isSubmitting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex border-b items-center border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                  <label
                    htmlFor="organizationAddress"
                    className="w-[55%] md:w-[40%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem] "
                  >
                    Organization Address
                    {partnershipType === "placement organization" ||
                    partnershipType === "both" ? (
                      <span className="text-[#FF5252] ">*</span>
                    ) : (
                      ""
                    )}
                  </label>
                  <input
                    className="bg-inherit w-full  focus:ring-0 appearance-none outline-none  text-[#101010] tracking-wider text-[0.8rem] md:text-[1.15rem] pl-1"
                    type="text"
                    id="organizationAddress"
                    aria-required="true"
                    {...register("organizationAddress", {
                      required: "Current Address is required",

                      onChange: (event) => {
                        setOrganizationAddress(event.target.value);
                      },
                    })}
                  />
                </div>
                <div className="flex items-center space-x-2 font-300 italic">
                  {partnershipType === "monetary donation" ? (
                    <small>Optional</small>
                  ) : (
                    ""
                  )}
                  {partnershipType !== "monetary donation" && (
                    <div>
                      {errors.organizationAddress && (
                        <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                          {errors.organizationAddress.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/*Organization website field*/}
              <div
                className={`flex flex-col  w-full md:w-[70%] lg:w-[60%]  ${
                  isSubmitting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex border-b items-center border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                  <label
                    htmlFor="organizationWebsite"
                    className="w-[55%] md:w-[40%] flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem] "
                  >
                    Organization Website
                    {partnershipType === "placement organization" ||
                    partnershipType === "both" ? (
                      <span className="text-[#FF5252] ">*</span>
                    ) : (
                      ""
                    )}
                  </label>
                  <input
                    className="bg-inherit w-full  focus:ring-0 appearance-none outline-none  text-[#101010] tracking-wider text-[0.8rem] md:text-[1.15rem] pl-1"
                    type="text"
                    id="organizationWebsite"
                    aria-required="true"
                    {...register("organizationWebsite", {
                      required: "Organization Website is required",
                      pattern: {
                        value:
                          /^(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/i,
                        message: "Invalid link ",
                      },
                      onChange: (event) => {
                        setOrganizationWebsite(event.target.value);
                      },
                    })}
                  />
                </div>
                <div className="flex items-center space-x-2 font-300 italic">
                  {partnershipType === "monetary donation" ? (
                    <small>Optional</small>
                  ) : (
                    ""
                  )}
                  {partnershipType !== "monetary donation" && (
                    <div>
                      {errors.organizationWebsite && (
                        <p className="text-red-500 pt-[2px] text-sm font-300 italic">
                          {errors.organizationWebsite.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/*Comment field*/}
              <div
                className={`flex flex-col  w-full md:w-[70%] lg:w-[60%]  ${
                  isSubmitting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex border-b items-center border-slate-700  text-[0.8rem] md:text-[1.15rem]">
                  <label
                    htmlFor="comment"
                    className="w-[30%] md:w-[20%]  flex z-50 font-[700] leading-[125%] text-[0.8rem] md:text-[1.18rem] "
                  >
                    Comment
                  </label>
                  <textarea
                    className="bg-inherit outline-none border-none  focus:ring-0 w-full text-[#101010] tracking-wider text-[0.8rem] md:text-[1.15rem] pl-1"
                    type="text"
                    id="comment"
                    aria-required="true"
                    {...register("comment", {
                      minLength: {
                        value: 3,
                        message: "Comment should have at least 3 characters",
                      },
                      onChange: (event) => {
                        setComment(event.target.value);
                      },
                    })}
                  ></textarea>
                </div>
                <div className="font-300 italic flex space-x-5 pt-[2px] items-center">
                  <small>Optional</small>
                  {errors.comment && (
                    <p className="text-red-500  text-sm ">
                      {errors.comment.message}
                    </p>
                  )}
                </div>
              </div>

              {partnershipType === "monetary donation" ||
              partnershipType === "both" ? (
                <PayButton
                  fullName={fullName}
                  currentAddress={currentAddress}
                  amount={paystackAmount}
                  email={email}
                  phone={phone}
                  comment={comment}
                  partnershipType={partnershipType}
                  organizationName={organizationName}
                  organizationAddress={organizationAddress}
                  organizationWebsite={organizationWebsite}
                />
              ) : (
                ""
              )}

              {partnershipType === "placement organization" && (
                <div className="text-center mt-[10px] py-9 ">
                  <button
                    disabled={disableButton}
                    type="submit"
                    className={`font-bold py-2 px-4 text-[1.3rem] rounded-md text-white ${
                      disableButton
                        ? "cursor-not-allowed bg-slate-300"
                        : "  bg-blue-600   transition duration-150 ease-in-out focus:outline-none hover:opacity-85"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Submitting
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    </ClientLayout>
  );
}
