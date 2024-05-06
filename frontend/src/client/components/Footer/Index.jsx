import NITDA from "../../../assets/images/nitda-logo.png";
import MISDE from "../../../assets/images/MISDE-Logo.svg";
export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-200 py-[1.5em]  lg:pl-24 px-6">
      <div className=" flex flex-col lg:flex-row space-y-8 lg:space-y-3  items-center  lg:space-x-5 text-[#1A2421]">
        <h2 className="font-bold text-[1.2rem] lg:text-2xl ">
          Sponsors and Partners:
        </h2>
        <div className=" grid grid-cols-3  lg:flex space-x-8  ">
          <span className="text-sm md:text-lg font-semibold">
            Akintunde Oyebode
          </span>

          <div className="w-[80px] h-[20px] md:w-[100px] bg-none">
            <img
              src={NITDA}
              alt="nitda_logo"
              loading="lazy"
              className="w-full h-full"
            />
          </div>
          {/*pipe divider*/}

          <div className="w-[125px] lg:w-[280px] h-[30px] bg-none">
            <img
              src={MISDE}
              alt="ministry_of_innovation_science_and_digital_economy"
              loading="lazy"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/***Enquiries***/}
      <div className="mt-6 flex flex-col space-y-4 items-center">
        <strong className="text-[0.95rem] text-center md:text-[1.15rem]  ">
          For enquiries
        </strong>
        <div className="flex flex-row space-x-4 items-center justify-center">
          <p className="font-semibold text-[0.7rem] md:text-[1rem]">
            <span className="font-bold"> Call or Whatsapp:</span> 08071572767
          </p>
          <p className="font-semibold text-[0.7rem] md:text-[1rem]">
            <span className="font-bold">Email:</span> techup@kinplusgroup.com
          </p>
        </div>
      </div>
    </footer>
  );
}
