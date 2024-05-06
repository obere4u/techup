import React from "react";
import { Link } from "react-router-dom";

export default function Week({ number, onClick}) {
  return (
    <div>
      <div className="flex border-r h-full px-4">
        <li
          className="text-center text-sm border rounded-full px-2 py-4 w-[80px] shadow-sm hover:shadow-md"
          onClick={onClick}
        >
          Week {number}
        </li>
      </div>
    </div>
  );
}
