// import React from "react";
// import sadEmoji from "../../../assets/images/sadEmoji.webp";
import { Link } from "react-router-dom";
import { ImSad } from "react-icons/im";
import ClientLayout from "../../utils/ClientLayout/Index";


export default function PageNotFound() {
  return (
    <ClientLayout>
      <section className=" flex flex-col md:flex-row md:justify-center space-y-4 items-center absolute top-[13em] xl:top-[15em] 2xl:top-[25em] left-0 right-0 pt-8">
        <div className=" ">
          <ImSad className="text-[10rem] mx-8 " />
        </div>

        <div>
          <p className="text-3xl font-bold">Page Not Found!</p>
          <p className="font-semibold py-4 text-2xl">
            Here are some useful links to guide you...
          </p>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-8 text-xl">
            <Link
              to={"/"}
              className="text-blue-800 font-bold underline hover:opacity-80 transition duration-150 ease-in-out"
            >
              Homepage
            </Link>
            <Link
              to={"/talent"}
              className="text-blue-800 font-bold underline hover:opacity-80 transition duration-150 ease-in-out"
            >
              Talents Form
            </Link>
            <Link
              to={"/partner"}
              className="text-blue-800 font-bold underline hover:opacity-80 transition duration-150 ease-in-out"
            >
              Partner Form
            </Link>
          </div>
        </div>
      </section>
    </ClientLayout>
  );
}
