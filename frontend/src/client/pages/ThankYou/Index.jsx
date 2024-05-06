import { Link, useLocation } from "react-router-dom";
import { RxHome } from "react-icons/rx";
import { useState, useEffect } from "react";
import ClientLayout from "../../utils/ClientLayout/Index";

export default function ThankYou() {
  const location = useLocation();
  const [thankYouText, setThankYouText] = useState("");

  useEffect(() => {
    const from = location.state?.from?.pathname;

    if (from === "/talent") {
      setThankYouText(
        `You have successfully registered and your application have been received. Shortlisted tech talents will be contacted via email...`
      );
    } else {
      setThankYouText(
        "Thank you for partnering with us, we received your donation..."
      );
    }
  }, [location]);

  return (
    <ClientLayout>
      <div className="flex flex-col space-y-8 items-center justify-center  py-10">
        <p className="font-bold text-[1.5rem] w-full md:w-[80%] lg:w-[70%] text-center px-4 lg:px-0">
          {thankYouText}
        </p>
        <Link
          to={"/"}
          className="flex items-center space-x-6 hover:space-x-4 bg-[#1A2421] py-2 px-4 rounded-md text-white font-semibold text-[1.1rem]"
        >
          <div>Go back to Homepage</div>
          <RxHome aria-hidden="true" />
        </Link>
      </div>
    </ClientLayout>
  );
}
