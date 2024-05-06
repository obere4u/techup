import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import DashBoardCardSkeleton from "./DashBoardCardSkeleton";

export default function DashboardCard({
  totalNumberOf,
  icon,
  title,
  to,
  totalName,
  loading,
  error,
}) {
  if (loading) return <DashBoardCardSkeleton />;

  if (error) return (
    <div className="border text-red-800 text-center font-semibold text-2xl pb-4 px-3 py-6 w-[80%] max-w-80 shadow-md rounded-md hover:shadow-lg animate-pulse">
      error !!!
    </div>
  );

  return (
    <div className="border  pb-4 px-3 w-[80%] max-w-80 shadow-md rounded-md hover:shadow-lg">
      {!loading && (
        <Link
          to={to}
          className="flex flex-col"
        >
          <span className="text-8xl mx-auto">{icon}</span>

          <h2 className="font-semibold text-center py-2 mb-2 text-2xl">
            {title}
          </h2>
          <p className="flex space-x-3">
            <span>{totalName} : </span>
            <span className="font-semibold">{totalNumberOf}</span>
          </p>
        </Link>
      )}
    </div>
  );
}

// Props validation
DashboardCard.propTypes = {
  totalNumberOf: PropTypes.number,
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  totalName: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};
