import { Footer } from "flowbite-react";

export default function TalentDashBoardFooter() {
  const currentYear = new Date().getFullYear();

  const FooterCustomTheme = {
    root: {
      base: "w-full flex items-center justify-center py-4 border-t rounded-lg dark:bg-gray-800 ",
      container: "w-full p-6",
      bgDark: "bg-gray-800",
    },
  };

  return (
    <Footer theme={FooterCustomTheme}>
      {/* Inner content here */}
      <div>
        <span>&copy;</span>
        <span>{currentYear}</span>
      </div>
      <a
        href="https://www.kinplusgroup.com"
        target="_blank"
        rel="noreferrer"
        className="ml-2 underline "
      >
        Kinplus Technologies™
      </a>
    </Footer>
  );
}
