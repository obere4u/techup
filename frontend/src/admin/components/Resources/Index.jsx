import { useState, useEffect } from "react";
import axios from "axios";
import { TALENT_API_URL } from "../../../API/talentAPI";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaPencil } from "react-icons/fa6";
import { LiaTimesSolid } from "react-icons/lia";
import Swal from "sweetalert2";
import FormModal from "../FormModal/Index";

export default function Resources() {
  const initialFormValues = {
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    educationQualification: "",
    stateOfResidence: "",
    LGAOfResidence: "",
    currentAddress: "",
    programOfChoice: "",
    experienceLevel: "",
    haveInternet: "",
    haveLaptop: "",
    timestamp: "",
    portfolioLink: "",
  };
  const [formData, setFormData] = useState(initialFormValues);
  const [resourcesData, setResourcesData] = useState([]);
  const [resourcesError, setResourcesError] = useState("");
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [paginationPageSize, setPaginationPageSize] = useState(20);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formModalOpen, setFormModalOpen] = useState(false);

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
      field: "phoneNumber",
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
      headerName: "Date of Birth",
      field: "dateOfBirth",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Program of Choice",
      field: "programOfChoice",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Experience Level",
      field: "experienceLevel",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Have Internet",
      field: "haveInternet",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Have Laptop",
      field: "haveLaptop",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Education Qualification",
      field: "educationQualification",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Portfolio",
      field: "portfolio",
      sortable: true,
      filter: true,
    },
    {
      headerName: "State of Residence",
      field: "stateOfResidence",
      sortable: true,
      filter: true,
    },
    {
      headerName: "LGA of Residence",
      field: "LGAOfResidence",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Test Score",
      field: "testScore",
      sortable: true,
      filter: true,
      width: 130,
    },
    {
      headerName: "Is Admitted",
      field: "isAdmitted",
      sortable: true,
      filter: true,
      width: 130,
      cellStyle: { marginRight: "auto", marginLeft: "auto" },
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
    {
      headerName: "Actions",
      field: "_id",
      sortable: false,
      cellStyle: { border: "none", outline: "none" },

      // Inside cellRenderer
      cellRenderer: (params) => {
        return (
          <div className="flex  items-center">
            <button
              onClick={() => handleUpdate(params.data)}
              className="flex items-center space-x-2 border border-blue-800 px-2 rounded-md text-blue-800 font-semibold hover:bg-opacity-80"
            >
              <span>UPDATE</span>{" "}
              <FaPencil
                className="text-lg text-blue-800"
                aria-hidden={"true"}
              />
            </button>

            <button
              onClick={() => handleDelete(params.value)}
              className="flex items-center space-x-2 border border-red-800 px-2 rounded-md text-red-800 font-semibold hover:bg-opacity-80"
            >
              <span>DELETE</span>{" "}
              <LiaTimesSolid className="text-lg text-red-800" />
            </button>
          </div>
        );
      },
    },
  ];

  const handleClickOpen = () => {
    setFormModalOpen(true);
  };

  const handleClose = () => {
    setFormModalOpen(false);
  };

  // Function to fetch talent data
  const fetchTalentData = async () => {
    try {
      setResourcesLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const resourcesResponse = await axios.get(TALENT_API_URL, {
        params: {
          _page: 1,
          limit: 20,
        },
      });

      const sortedData = resourcesResponse.data.sort((a, b) => {
        const nameA = a.fullName.toLowerCase();
        const nameB = b.fullName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      const sortedDataWithSerialNumber = sortedData.map((talent, index) => ({
        ...talent,
        number: index + 1,
      }));

      setResourcesData(sortedDataWithSerialNumber);
      setResourcesLoading(false);
    } catch (error) {
      setResourcesError(error);
      console.error(error);
      setResourcesLoading(false);
    }
  };

  useEffect(() => {
    fetchTalentData();
  }, [paginationPageSize, refreshKey]);

  // Handle pagination change
  const handlePaginationChange = (pageNumber, pageSize) => {
    setPaginationPageSize(pageSize);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setTalentLoading(true);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const onChange = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Function to save the edited value
  const handleFormSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formData._id) {
        // Update talent data
        const putResponse = await axios.put(
          `${TALENT_API_URL}/${formData._id}`,
          formData
        );

        // Display success message
        Swal.fire({
          icon: "success",
          text: "Talent updated successfully...",
        });
      } else {
        // Add new talent data
        const postResponse = await axios.post(TALENT_API_URL, formData);
        console.log("postResponse: ", postResponse);

        // Fetch updated talent data
        await fetchTalentData();

        // Display success message
        Swal.fire({
          icon: "success",
          text: "Talent added successfully...",
        });
      }

      // Reset form data to initial values
      setFormData(initialFormValues);
    } catch (error) {
      // Display error message
      Swal.fire({
        icon: "error",
      });
      console.log(error.response);
    }
  };

  // Function to save the edited value
  const handleUpdate = (oldData) => {
    setFormData(oldData);
    handleClickOpen();
  };

  // Function to cancel editing
  const handleDelete = async (_id) => {
    Swal.fire({
      text: "Do you want to delete Talent?",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${TALENT_API_URL}/${_id}`)
          .then(() => {
            fetchTalentData();
            Swal.fire({
              icon: "success",
              text: "Talent deleted successfully",
            });
          })
          .catch((error) => {
            console.error("Error deleting talent:", error);
            Swal.fire({
              icon: "error",
              text: "Error... Try again",
            });
          });
      }
    });
  };

  //error button
  const errorText =
    resourcesError && !resourcesLoading ? "An error occurred !!!" : "";
  const btnText = resourcesLoading ? "Loading ..." : "Refresh";

  return (
    <div className="ag-theme-alpine h-[calc(100%-theme(space.52))] w-full relative ">
      {resourcesError || resourcesLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4 absolute bottom-1/2 top-1/2 left-[40%] right-[40%]">
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
          <button
            className="border border-blue-800 px-2 ml-4 rounded-md text-blue-800 text-lg font-semibold hover:text-opacity-80"
            onClick={handleClickOpen}
          >
            Add Resources
          </button>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={resourcesData}
            pagination={true}
            paginationPageSize={paginationPageSize}
            loading={resourcesLoading}
            onPaginationChanged={(event) =>
              handlePaginationChange(
                event.api.paginationGetCurrentPage() + 1,
                event.api.paginationGetPageSize()
              )
            }
            className="px-4 mt-4"
          />
        </>
      )}

      {formModalOpen && (
        <FormModal
          formModalOpen={formModalOpen}
          handleClose={handleClose}
          onChange={onChange}
          data={formData}
          handleFormSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
