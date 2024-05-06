import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DashBoardCardSkeleton() {
  return (
    <div  className="border pt-2 pb-4 px-3 w-[80%] max-w-80 shadow-md rounded-md hover:shadow-lg flex flex-col cursor-pointer">
      <span className="text-8xl mx-auto">
        <Skeleton
          circle={true}
          height={100}
          width={100}
        />
      </span>

      <h2 className="font-semibold text-center py-2 mb-2 text-2xl w-1/2 mx-auto">
        <Skeleton />
      </h2>
      <p className="flex space-x-3">
        <span>
          <Skeleton width={80} />
        </span>
        <span className="font-semibold">
          <Skeleton width={50} />
        </span>
      </p>
    </div>
  );
}
