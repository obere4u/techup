import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TALENT_API_URL } from "../../../API/talentAPI";
import { FaPencil } from "react-icons/fa6";
import { LiaTimesSolid } from "react-icons/lia";
import Swal from "sweetalert2";
import FormModal from "../FormModal/Index";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody } from "flowbite-react";
import PropTypes from "prop-types";
import TalentTable from "./TalentTable";

export default function Talents() {
  const initialFormValues = {
    /* initial form values */
  };
  // const [data, setData] = useState([])
  const [formData, setFormData] = useState(initialFormValues);
  // const [refreshKey, setRefreshKey] = useState(0);
  const [formModalOpen, setFormModalOpen] = useState(false);

  return (
    <div>
      {/* Display form modal */}
      {formModalOpen && (
        <FormModal
          formModalOpen={formModalOpen}
          handleClose={() => setFormModalOpen(false)}
          data={formData}
        />
      )}

      {/* Display table*/}
      <TalentTable />
    </div>
  );
}

