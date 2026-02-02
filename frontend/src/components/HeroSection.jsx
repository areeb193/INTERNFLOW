import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { animate } from "animejs";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "../redux/jobSlice";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const headingRef = useRef(null);

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  useEffect(() => {
    if (headingRef.current) {
      animate(".hero-animate", {
        opacity: [0, 1],
        translateY: [50, 0],
        delay: (el, i) => i * 100,
        duration: 1200,
        easing: "out(3)",
      });
    }
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#6A38C2]/5 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#F83002]/5 blur-3xl animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6A38C2]/10 to-[#F83002]/10 backdrop-blur border border-[#6A38C2]/20">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#6A38C2] to-[#F83002] animate-pulse" />
              <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] to-[#F83002]">
                #1 Internship Hunt Platform
              </span>
            </div>

            <div ref={headingRef} className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                <span className="hero-animate block text-gray-900">Launch Your</span>
                <span className="hero-animate block bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] via-purple-600 to-[#F83002]">
                  Career Journey
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                Connect with top companies, discover amazing opportunities, and land your dream internship with ease.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded-full opacity-30 group-hover:opacity-50 blur transition duration-300" />
              <div className="relative flex items-center bg-white rounded-full shadow-xl px-2 py-2">
                <input
                  type="text"
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by role, company, or keyword..."
                  className="flex-1 outline-none border-none px-4 py-3 text-gray-700 placeholder:text-gray-400"
                />
                <Button
                  onClick={searchJobHandler}
                  className="bg-gradient-to-r from-[#6A38C2] to-[#F83002] text-white rounded-full px-8 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] to-[#F83002]">500+</h3>
                <p className="text-sm text-gray-600">Active Companies</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] to-[#F83002]">1000+</h3>
                <p className="text-sm text-gray-600">Open Positions</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] to-[#F83002]">95%</h3>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden md:block">
            <div className="relative z-10">
              {/* Decorative Cards */}
              <div className="absolute top-0 right-0 w-64 h-40 bg-white rounded-2xl shadow-2xl p-6 transform rotate-6 hover:rotate-3 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6A38C2] to-[#F83002]" />
                  <div>
                    <h4 className="font-semibold text-sm">Software Engineer</h4>
                    <p className="text-xs text-gray-500">Google Inc.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">Remote</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">Full-time</span>
                </div>
              </div>
              
              <div className="absolute bottom-10 left-0 w-64 h-40 bg-white rounded-2xl shadow-2xl p-6 transform -rotate-6 hover:-rotate-3 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F83002] to-[#6A38C2]" />
                  <div>
                    <h4 className="font-semibold text-sm">UI/UX Designer</h4>
                    <p className="text-xs text-gray-500">Meta</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">Hybrid</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">Internship</span>
                </div>
              </div>

              {/* Center piece */}
              <div className="relative w-72 h-72 mx-auto mt-20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6A38C2] to-[#F83002] rounded-3xl transform rotate-12 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#6A38C2] to-[#F83002] rounded-3xl transform -rotate-6 opacity-40" />
                <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#6A38C2] to-[#F83002] flex items-center justify-center">
                      <Search className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Find Your Path</h3>
                    <p className="text-sm text-gray-600 mt-2">Start Exploring Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
