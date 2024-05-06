import { useState, useEffect } from "react";
import axios from "axios";
import { PARTNERS_API_URL } from "../../../API/partnerAPI";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Partners() {
  const [partnerData, setPartnerData] = useState(null);
  const [partnerError, setPartnerError] = useState("");
  const [partnerLoading, setPartnerLoading] = useState(false);
  const [paginationPageSize, setPaginationPageSize] = useState(20);
  const [refreshKey, setRefreshKey] = useState(0);

  //call the fetchPartnerData
  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let shouldUpdate = true;
    const fetchPartnerData = async () => {
      try {
        // Set loading true
        setPartnerLoading(true);

        // Simulate a delay of 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const partnerResponse = await axios.get(PARTNERS_API_URL, {
          params: {
            _page: 1,
            limit: 20,
          },
        });

        // Sort data in alphabetical order
        const sortedData = partnerResponse.data.sort((a, b) => {
          const nameA = a.fullName.toLowerCase();
          const nameB = b.fullName.toLowerCase();
          // Sort with unicode
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });

        //add serial numbers
        const sortedDataWithNumber = sortedData.map((partner, index) => ({
          ...partner,
          number: index + 1,
        }));

        setPartnerData(sortedDataWithNumber);

        // Set loading false after data is fetched
        setPartnerLoading(false);
      } catch (error) {
        // Error handling
        setPartnerError(error);
        console.error(error);

        // Set loading false on error
        setPartnerLoading(false);
      }
    };
    fetchPartnerData();

    //cleanup
    return () => {
      shouldUpdate = false;
    };
  }, [paginationPageSize, refreshKey]);

  //pagination change
  const handlePaginationChange = (pageNumber, pageSize) => {
    setPaginationPageSize(pageSize);
  };

  // Handle refresh button to trigger re-render
  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  //error button
  const errorText =
    partnerError && !partnerLoading ? "An error occurred !!!" : "";
  const btnText = partnerLoading ? "Loading ..." : "Refresh";

  //Table columns
  const columnDefs = [
    {
      headerName: "No",
      field: "number",
      sortable: true,
      filter: true,
      width: 75,
    },
    {
      headerName: "Full Name",
      field: "fullName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Phone Number",
      field: "phone",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Current Address",
      field: "currentAddress",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Partnership Type",
      field: "partnershipType",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Amount",
      field: "amount",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Organization Name",
      field: "organizationName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Organization Address",
      field: "organizationAddress",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Organization Website",
      field: "organizationWebsite",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Comment",
      field: "comment",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Created At",
      field: "createdAt",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Updated At",
      field: "updatedAt",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <div className="ag-theme-alpine h-[530px] w-full relative">
      {/*Error Loading data*/}
      {partnerError || partnerLoading ? (
        <div className="flex flex-col items-center justify-center space-y-8 absolute bottom-1/2 top-1/2 left-[40%] right-[40%]">
          <span className="text-2xl font-semibold mt-10">{errorText}</span>
          <button
            className="py-3 px-6 bg-blue-500 text-[1.1rem] text-white font-semibold w-fit rounded-md  hover:opacity-85 transition-opacity duration-150 ease-in-out absolute bottom-0"
            onClick={handleRefresh}
          >
            {btnText}
          </button>
        </div>
      ) : (
        <>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={partnerData}
            pagination={true}
            paginationPageSize={paginationPageSize}
            loading={partnerLoading}
            onPaginationChanged={(event) =>
              handlePaginationChange(
                event.api.paginationGetCurrentPage() + 1,
                event.api.paginationGetPageSize()
              )
            }
          />
        </>
      )}
    </div>
  );
}
