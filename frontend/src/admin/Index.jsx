
import NavigationBar from "./NavigationBar/Index";
import MainContent from "./MainContent/Index";

export default function Admin() {
  return (
    <div className="flex ">
      <NavigationBar />

      {/*Main content*/}
      <MainContent/>
    </div>
  );
}
