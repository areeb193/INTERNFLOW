import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchJobByText } from "../../redux/jobSlice";
import { useState } from "react";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
const Adminjobs = () => {
  const navigate = useNavigate();
   useGetAllAdminJobs();
  const [input , setinput] = useState("");
  const dispatch = useDispatch();
  useEffect(()=>{
         dispatch(setSearchJobByText(input));
  },[input])
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input 
            className="w-fit" 
            placeholder="Filter by name"
            onChange={(e) => setinput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/jobs/create")}>
            New jobs
          </Button>
        </div>
        <AdminJobsTable/>
      </div>
    </div>
  );
};

export default Adminjobs;
