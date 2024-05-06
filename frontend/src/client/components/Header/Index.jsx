import { Link } from "react-router-dom";
import kinplusLogo from "../../../assets/images/kinplus.jpg";
export default function Header() {
  return (
    <div className=" bg-[#1A2421] py-[2em]">
      <div className="flex flex-col justify-center md:flex-row md:justify-between items-center  space-y-3 lg:space-x-20 w-[95%]  mx-auto p-1">
        <Link
          to="/"
          className="w-[20%] lg:w-[10%] "
        >
          <img
            src={kinplusLogo}
            alt="kinplus written with a blue color used as logo."
            loading="lazy"
            className="w-full"
          />
        </Link>

        <h1 className="w-full md:w-[75%] text-[#f1f1f1] text-center font-bold text-[1.2rem] lg:text-4xl capitalize">
          Digital Skill Training & Internship<br></br> for Youths in Ekiti State <span className="block text-[1.05rem] lg:text-[1.8rem] text-blue-500">(Online &
          Onsite)</span>
        </h1>
      </div>
    </div>
  );
}
