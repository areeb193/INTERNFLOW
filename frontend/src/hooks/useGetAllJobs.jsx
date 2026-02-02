import { useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { JOB_API_END_POINT } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setAllJobs, setOriginalJobs } from '../redux/jobSlice';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=> store.job);
    const { user } = useSelector((state) => state.auth);
    
    useEffect(() => {
        const fetchAllJobs = async () => {
            console.log("useGetAllJobs - user:", user);
            console.log("useGetAllJobs - searchedQuery:", searchedQuery);
            
            if (!user) {
                console.log('User not authenticated, skipping job fetch');
                return;
            }
            
            try {
                // Use /search endpoint if there's a search query, otherwise use /get
                const endpoint = searchedQuery ? '/search' : '/get';
                const queryParam = searchedQuery ? `?keywords=${searchedQuery}` : '';
                
                console.log("useGetAllJobs - Making API call to:", `${JOB_API_END_POINT}${endpoint}${queryParam}`);
                const res = await axiosInstance.get(`${JOB_API_END_POINT}${endpoint}${queryParam}`);
                console.log("useGetAllJobs - API response:", res.data);
                if (res.data.success) {
                    console.log("useGetAllJobs - Dispatching jobs:", res.data.jobs);
                    dispatch(setAllJobs(res.data.jobs));
                    dispatch(setOriginalJobs(res.data.jobs)); // Store original jobs for filtering
                }
            }
            catch (error) {
                // Handle 404 gracefully - it just means no jobs exist yet
                if (error.response?.status === 404) {
                    console.log('No jobs found in database - database may be empty');
                    dispatch(setAllJobs([]));
                    dispatch(setOriginalJobs([]));
                } else if (error.response?.status === 401) {
                    console.log('Authentication required for fetching jobs');
                } else {
                    console.error('Error fetching jobs:', error);
                }
            }
        };
        fetchAllJobs();
    }, [dispatch, user, searchedQuery]);
};

export default useGetAllJobs;