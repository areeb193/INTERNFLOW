import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";



const LatestJobCards = ({ job }) => {

const navigate = useNavigate();
  return (
    <div 
      onClick={()=>navigate(`/description/${job._id}`)}  
      className="group relative p-6 rounded-2xl bg-white border-2 border-gray-100 cursor-pointer hover:border-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6A38C2]/5 via-transparent to-[#F83002]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Company Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#6A38C2] to-[#F83002] ring-2 ring-white shadow-lg flex items-center justify-center text-xl font-bold text-white group-hover:scale-110 transition-transform">
              {(job?.company?.name || 'I')[0]}
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 group-hover:text-[#6A38C2] transition-colors">
                {job?.company?.name}
              </h1>
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Pakistan
              </p>
            </div>
          </div>
          
          {/* Bookmark icon */}
          <div className="h-8 w-8 rounded-full bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-[#6A38C2] group-hover:to-[#F83002] flex items-center justify-center transition-all">
            <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
            {job?.title}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {job?.description}
          </p>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-5 flex-wrap">
          <Badge className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 font-medium" variant="secondary">
            {job?.positions} {job?.positions > 1 ? 'Positions' : 'Position'}
          </Badge>
          <Badge className="bg-gradient-to-r from-orange-50 to-orange-100 text-[#F83002] border border-orange-200 font-medium" variant="secondary">
            {job?.jobType}
          </Badge>
          <Badge className="bg-gradient-to-r from-purple-50 to-purple-100 text-[#6A38C2] border border-purple-200 font-medium" variant="secondary">
            {job?.salary} LPA
          </Badge>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">View Details</span>
            <div className="flex items-center gap-1 text-[#6A38C2] font-semibold group-hover:gap-2 transition-all">
              <span className="text-sm">Apply Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestJobCards;
