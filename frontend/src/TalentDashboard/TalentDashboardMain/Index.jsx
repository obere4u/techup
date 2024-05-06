import { useEffect, useState } from "react";
import WeekContents from "../components/WeekContents/Index";
import { useSelector } from "react-redux";
import { format, getHours } from "date-fns";

export default function TalentDashBoardMain() {
  const { currentUser } = useSelector((state) => state.user);
  const [greetUser, setGreetUser] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date().getHours());
  const formattedDate = format(currentTime, "HH:mm:ss"); // Add loading state

  useEffect(() => {
    const currentTimeHour = getHours(currentTime).toString().padStart(2, "0");

    switch (true) {
      case currentTimeHour >= 0 && currentTimeHour < 12:
        setGreetUser("Good Morning");
        break;
      case currentTimeHour >= 12 && currentTimeHour < 18:
        setGreetUser("Good Afternoon");
        break;
      case currentTimeHour >= 18 && currentTimeHour < 24:
        setGreetUser("Good Evening");
        break;

      default:
        setGreetUser("Howdy! ");
    }

    // Update the time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentTime, formattedDate]);

  return (
    <div>
      <h1 className=" py-1 text-center">
        <span className="">{greetUser}</span>
        <span className="font-semibold "> {currentUser.fullName}</span>
      </h1>
      <br/>
      <WeekContents />
    </div>
  );
}
