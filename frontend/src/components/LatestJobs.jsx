import React from 'react'
import { useSelector } from 'react-redux';
import LatestJobCards from './LatestJobCards'


//const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const LatestJobs = () => {
  const { allJobs = [] } = useSelector(store => store.job || {});

  return (
    <div className='py-20 bg-gradient-to-b from-white to-gray-50'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6A38C2]/10 to-[#F83002]/10 mb-4">
            <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] to-[#F83002]">
              Featured Opportunities
            </span>
          </div>
          <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight mb-4'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] to-[#F83002]'>Latest & Top</span>
            <br className="md:hidden" />
            <span className='text-gray-900'> Internship Openings</span>
          </h1>
          <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
            Hand-picked opportunities from leading companies waiting for talented individuals like you
          </p>
        </div>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12'>
          {
            allJobs.length < 1 ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#6A38C2]/10 to-[#F83002]/10 mb-4">
                  <span className="text-4xl">📭</span>
                </div>
                <p className="text-gray-500 text-lg">No jobs found at the moment</p>
                <p className="text-gray-400 text-sm mt-2">Check back soon for new opportunities!</p>
              </div>
            ) : allJobs.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)
          }
        </div>
      </div>
    </div>
  )
}


export default LatestJobs