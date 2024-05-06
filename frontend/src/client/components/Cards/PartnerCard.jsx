import { Link } from "react-router-dom";
import partnership from "../../../assets/images/partnership.webp";
import { BsCaretRight } from "react-icons/bs";

export default function PartnerCard() {
  const partnerDesc =
    "We welcome funders, corporates, placement organizations, and all those eager to make a meaningful impact and shape the future with us. Together, we can build a brighter tomorrow in our dear state!";

  return (
    <div className="h-full flex flex-col space-y-5  pt-4 pb-8 px-5 w-full md:w-[65%] lg:w-[45%] bg-[#1A2421] border rounded-t-[1em]">
      <div className="w-full">
        <img
          src={partnership}
          alt="people_trying_to_join_two_different_images_in_partnership"
          className="w-full  rounded-t-[1em]"
        />
      </div>
      <h2 className="text-[#f1f1f1] font-bold text-[1.08rem] sm:text-[1.3rem]  leading-[180%]">
        For Partners and Sponsors
      </h2>
      <p className="text-[#ffffff] leading-[185%] text-[1.02rem]">
        {partnerDesc}
      </p>
      <Link
        to={{ pathname: "/partner", state: { scrollToTop: "true" } }}
        className="justify-self-end w-[60%] sm:w-[70%]  md:w-[45%] lg:w-[75%] xl:w-[50%] flex items-center bg-[#f1f1f1] transition duration-150 ease-in-out focus:outline-none hover:opacity-80  font-bold py-2 px-4 text-[1.05rem] text-[#1A2421] rounded-md"
      >
        <span>Partner with us</span>
        <BsCaretRight
          className="ml-auto"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
