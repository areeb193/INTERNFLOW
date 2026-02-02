import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '../utils/constant'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setSingleJob } from '../redux/jobSlice'
import { toast } from 'sonner'
const JobDescription = () => {
  const { user } = useSelector(store => store.auth);
  const { singleJob } = useSelector(store => store.job);
  const dispatch = useDispatch();
  const [isApplied, setIsApplied] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
      if (res.data.success) {
        // Update the local state immediately
        setIsApplied(true);
        
        // Update Redux store with new application
        const updatedSingleJob = {
          ...singleJob,
          applications: [...(singleJob.applications || []), { applicant: user?._id }]
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to apply for job');
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
        console.log('Fetched job data:', res.data);
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          const hasApplied = res.data.job.applications?.some(application => application.applicant === user?._id) || false;
          setIsApplied(hasApplied);
        }
      }
      catch (error) {
        if (error.response?.status === 404) {
          console.log('Job not found or deleted');
          toast.error('Job not found');
        } else {
          console.error('Error fetching job:', error);
          toast.error('Failed to load job details');
        }
      }
    };
    fetchSingleJob();
  }, [dispatch, jobId, user?._id]);

  return (
    <div className='max-w-7xl mx-auto my-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-bold text-xl '>{singleJob?.title}</h1>
          <div className="flex item-center gap-2 mt-4">
            <Badge className="text-blue-700 font-bold" variant="ghost">{singleJob?.positions} Position</Badge>
            <Badge className="text-[#F83002] font-bold" variant="ghost">{singleJob?.jobType}</Badge>
            <Badge className="text-[#7209b7] font-bold" variant="ghost">{singleJob?.salary} lpa</Badge>
          </div>
        </div>
        <button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg px-6 py-3 text-base ${isApplied ? "bg-gray-600 cursor-not-allowed" : "bg-[#7209b7] hover:bg-[#560bad]"}`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </button>
      </div>
      <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
      <div className='my-4'>
        <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
        <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
        <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
        <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experience || singleJob?.experienceLevel || 'Not specified'}</span></h1>
        <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}</span></h1>
        <h1 className='font-bold my-1'>Total applicant: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length || 0}</span></h1>
        <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt?.split("T")[0] || 'N/A'}</span></h1>
      </div>
    </div>
  )
}

export default JobDescription;