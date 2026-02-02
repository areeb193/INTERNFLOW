import { Job } from '../models/job.model.js';
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary,location, jobType,experience , position , companyId } = req.body;
        const userId = req.id;

        if (!title || !description  || !location || !salary  || !companyId|| !jobType || !experience || !position || !requirements) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(','),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            createdBy: userId
        });
        return res.status(201).json({ message: 'Job posted successfully', success: true, job });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}



export const getJobs = async (req, res) => {
    try{
        const keywords = req.query.keywords || '';
        const query = {
            $or: [
                { title: { $regex: keywords, $options: 'i' } },
                { description: { $regex: keywords, $options: 'i' } }
            ]
            };

            const jobs = await Job.find(query)
                .populate({
                    path: 'company',
                    select: 'name logo userId createdAt updatedAt'
                })
                .sort({ createdAt: -1 });
            if (!jobs || jobs.length === 0) {
                return res.status(404).json({ message: 'No jobs found', success: false });
            }
            return res.status(200).json({ message: 'Jobs retrieved successfully', success: true, jobs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate('applications').populate('company', 'name logo');
        if (!job) {
            return res.status(404).json({ message: 'Job not found', success: false });
        }
        return res.status(200).json({ message: 'Job retrieved successfully', success: true, job });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
} 

export const getAdminJobs = async (req, res) => {
    try{
        const adminId= req.id;
        const jobs = await Job.find({createdBy: adminId}).populate({
            path:'company',
            select: 'name logo'
        });
        if (!jobs || jobs.length === 0) {
            return res.status(200).json({ message: 'No jobs found', success: true, jobs: [] });
        }
        return res.status(200).json({ message: 'Jobs retrieved successfully', success: true, jobs });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('company', 'name logo').populate('createdBy', 'fullname');
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: 'No jobs found', success: false });
        }
        return res.status(200).json({ message: 'Jobs retrieved successfully', success: true, jobs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}