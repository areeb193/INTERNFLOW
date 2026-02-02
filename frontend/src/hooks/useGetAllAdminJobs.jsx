import { useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { JOB_API_END_POINT } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setAllAdminJobs, setAllJobs } from '../redux/jobSlice';

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    
    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            if (!user) {
                console.log('User not authenticated, skipping job fetch');
                dispatch(setAllAdminJobs([]));
                return;
            }
            
            try {
                const res = await axiosInstance.get(`${JOB_API_END_POINT}/getadminjobs`);
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs || []));
                }
            }
            catch (error) {
                console.error('Error fetching jobs:', error);
                // Clear admin jobs on error
                dispatch(setAllAdminJobs([]));
                if (error.response?.status === 401) {
                    console.log('Authentication required for fetching jobs');
                }
            }
        };
        fetchAllAdminJobs();
    }, [user, dispatch]);
};

export default useGetAllAdminJobs;