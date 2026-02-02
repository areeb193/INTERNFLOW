import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, User2 } from "lucide-react"
import { useSelector } from 'react-redux'
import { USER_API_END_POINT } from '../../utils/constant'
import axiosInstance from '../../utils/axiosConfig'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/authSlice'
import { clearJobData } from '../../redux/jobSlice'
import { toast } from 'sonner'
import { persistor } from '../../redux/store';

const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const logoutHandler = async () => {
    try {
      const res = await axiosInstance.get(`${USER_API_END_POINT}/logout`)
      if (res.data.success) {
        // Clear all Redux state
        dispatch(logout());
        dispatch(clearJobData());
        
        // CRITICAL: Purge all persisted data from localStorage
        await persistor.purge();
        
        // Clear localStorage manually as well
        localStorage.clear();
        
        navigate('/');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      
      // Even if server logout fails, clear local data
      dispatch(logout());
      dispatch(clearJobData());
      await persistor.purge();
      localStorage.clear();
      
      navigate('/');
      toast.success('Logged out successfully');
    }
  }
  return (
    <div className='sticky top-0 z-50 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-white/20 shadow-sm'>
      <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
        <div className="select-none">
          <h1 className='text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] to-[#F83002]'>Internship<span className='ml-1'>Portal</span></h1>
        </div>
        <div className='flex items-center gap-8'>
          {/* JobLensAI Button */}
          <Link to="https://job-lens-ai-six.vercel.app/" target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-white to-blue-500 font-bold text-lg"
            >
              AIChecker
            </Button>
          </Link>

          {/* Navigation Links */}
          <ul className='flex font-medium items-center gap-5'>
            {
              user && user.role==='recruiter' ?(
                <>
                <li><Link className="hover:underline underline-offset-4 hover:text-[#6A38C2] transition-colors" to="/admin/companies">Companies</Link></li>
                <li><Link className="hover:underline underline-offset-4 hover:text-[#6A38C2] transition-colors" to="/admin/jobs">Internships</Link></li>
                </>
              ):(
                <>
                <li><Link className="hover:underline underline-offset-4 hover:text-[#6A38C2] transition-colors" to="/">Home</Link></li>
                <li><Link className="hover:underline underline-offset-4 hover:text-[#6A38C2] transition-colors" to="/jobs">Internship</Link></li>
                <li><Link className="hover:underline underline-offset-4 hover:text-[#6A38C2] transition-colors" to="/browse">Browse</Link></li>
                <li><Link className="hover:underline underline-offset-4 hover:text-[#6A38C2] transition-colors" to="/job-hunt">Internship Hunt</Link></li>
                </>
              )
            }
            
          </ul>

          {/* User Buttons */}
          {!user ? (
            <div className='flex items-center gap-3'>
              <Link to="/Login"><Button variant="outline" className="mr-2 hover:shadow-md transition-all">Login</Button></Link>
              <Link to="/Signup"><Button className="bg-gradient-to-r from-[#6A38C2] to-[#F83002] text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">Signup</Button></Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className='cursor-pointer ring-1 ring-black/5 hover:ring-[#6A38C2]/30 transition-all'>
                  <AvatarImage src={user?.profile?.profilePicture} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className='rounded-xl shadow-xl border border-gray-100'>
                <div className='flex gap-4 space-y-2'>
                  <Avatar className='cursor-pointer ring-1 ring-black/5'>
                    <AvatarImage src={user?.profile?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className='font-medium'>{user?.fullname}</h4>
                    <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                  </div>
                </div>
                <div className='flex flex-col my-2 text-gray-600'>
                 
                 {
                  user && user.role === 'student' &&(
                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                    <User2 />
                    <Button variant="link"><Link to="/profile">View profile</Link></Button>
                  </div>
                  )
                 }
                 
                 
                  
                  <div className='flex w-fit items-center gap-2 cursor-pointer'>
                    <Button onClick={logoutHandler} variant="link">
                      <LogOut />
                      logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
