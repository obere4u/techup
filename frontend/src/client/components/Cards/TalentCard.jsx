import { Link } from "react-router-dom";
import girlsCode from "../../../assets/images/Girls_code.webp";
import { BsCaretRight } from "react-icons/bs";

export default function Talent() {
  const talentDesc =
    "Get ready to dive into tailored technical training designed to elevate your skills and make you a force to be reckoned with in both local and global tech arenas. It's all about empowering you to shine brightly in the ever-evolving world of technology";

  return (
    <div className="flex flex-col pt-4 pb-8 px-5 w-full h-full md:w-[65%] lg:w-[45%] border rounded-t-[1em]">
      <div className="w-full mb-5">
        <img
          src={girlsCode}
          alt="ladies_working_with_a_laptop"
          className="w-full rounded-t-[1em]"
        />
      </div>
      <h2 className="mb-5 font-bold text-[1.3rem]">For Talents</h2>
      <p className="leading-[185%]">{talentDesc}</p>
      <div className="flex items-center space-x-4 mt-auto">
        <div
          className="w-[55%] sm:w-[60%]  md:w-[40%]  lg:w-[60%] xl:w-[45%] flex items-center bg-gray-300 font-bold py-2 px-4 text-[1.05rem] text-[#f1f1f1] rounded-md cursor-not-allowed"
          disabled
        >
          <span>Apply Here</span>
          <BsCaretRight
            aria-hidden="true"
            className="ml-auto"
          />
        </div>
        {/*Login link*/}
        <Link
          to={{ pathname: "/talent-signin", state: { scrollToTop: "true" } }}
          className="w-[55%] sm:w-[60%]  md:w-[40%]  lg:w-[60%] xl:w-[45%] flex items-center bg-[#1A2421] transition duration-150 ease-in-out focus:outline-none hover:opacity-90  font-bold py-2 px-4 text-[1.05rem] text-[#f1f1f1] rounded-md"
        >
          <span>Login Here</span>
          <BsCaretRight
            aria-hidden="true"
            className="ml-auto"
          />
        </Link>
      </div>
    </div>
  );
}
