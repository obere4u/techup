import { useMemo, useState } from "react";
import { columnDef } from "./components/Columns";
import { user } from "./mockData";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TALENT_API_URL } from "../../../API/talentAPI";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableFooter,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";

export default function TalentTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch data using useQuery
  const fetchTalentData = async () => {
    try {
      const response = await axios.get(TALENT_API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching talent data:", error);
      throw new Error("Error fetching talent data");
    }
  };

  const { data: talentData } = useQuery({
    queryKey: ["talentData"],
    queryFn: () => fetchTalentData(),
    keepPreviousData: true,
  });

  // Map talentData to match the structure expected by the table
  const formattedData = useMemo(() => {
    if (!talentData) return [];
    return talentData?.map((talent) => ({
      fullName: talent.fullName,
      email: talent.email,
      phoneNumber: talent.phoneNumber,
      dateOfBirth: talent.dateOfBirth,
      educationQualification: talent.educationQualification,
      stateOfResidence: talent.stateOfResidence,
      LGAOfResidence: talent.LGAOfResidence,
      portfolioLink: talent.portfolioLink,
      programOfChoice: talent.programOfChoice,
      experienceLevel: talent.experienceLevel,
      haveLaptop: talent.haveLaptop,
      haveInternet: talent.haveInternet,
      gender: talent.gender,
      currentAddress: talent.currentAddress,
    }));
  }, [talentData]);

  const columns = useMemo(() => columnDef, []);
  const data = formattedData;

  // console.log("data: ", user);

  const tableInstance = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      //   columnOrder: ["fullName", "email", "phoneNumber"],
      columnVisibility: {
        id: false, //hide the id column by default
      },
      // expanded: true, //expand all rows by default
      // sorting: [
      //   {
      //     id: "dateOfBirth",
      //     desc: true, //sort by age in descending order by default
      //   },
      // ],
    },
  });

  return (
    <div className="max-w-full mx-4 px-4">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        {/*Head */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {tableInstance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  scope="col"
                  className="mx-8 px-4 py-2"
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
              <th
                scope="col"
                className="py-3"
              >
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          ))}
        </thead>
        {/*Body */}
        <tbody>
          {tableInstance.getRowModel().rows.map((rowElement) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              key={rowElement.id}
            >
              {rowElement.getVisibleCells().map((cellElement) => (
                <td
                  className="px-3 py-4"
                  key={cellElement.id}
                >
                  {cellElement.column.id === "portfolioLink" &&
                  !cellElement.value
                    ? // Render an empty string if portfolioLink is empty
                      ""
                    : // Render the cell content if it's not portfolioLink or if portfolioLink has a value
                      flexRender(
                        cellElement.column.columnDef.cell,
                        cellElement.getContext()
                      )}
                </td>
              ))}
              <td className="px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 mr-4"
                >
                  Edit
                </a>
                <a
                  href="#"
                  className="font-medium text-red-600 hover:underline dark:text-red-500"
                >
                  Delete
                </a>
              </td>
              {/* If you need an additional cell at the end of each row, you can add it here */}
            </tr>
          ))}
        </tbody>
        {/*Footer
          <tfoot>
            {tableInstance.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <td key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>*/}
      </table>
    </div>
  );
}
