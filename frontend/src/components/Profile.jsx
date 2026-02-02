import React from 'react'
import Navbar from './shared/Navbar'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import useGetAppliedJobs from '../hooks/useGetAppliedjobs'
const Skills = ['JavaScript', 'React', 'Node.js', 'CSS'];
const isResume = true;
const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={user?.profile?.profilePicture || ''} 
                alt={user?.fullname || 'User'}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-bold">
                {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-medium text-xl'>{user?.fullname}</h1>
              <p>{user?.profile?.bio}</p>
            </div>

          </div>
          <Button onClick={() => setOpen(true)} className='text-right' variant="outline"><Pen /></Button>

        </div>
        <div className='my-5'>
          <div className='flex items-center gap-3 my-2'>
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className='flex items-center gap-3 my-2'>
            <Contact />
            <span>{user?.phoneNumber}</span>

          </div>
          <h1>Skills</h1>
          <div className='flex items-center gap-3 my-2'>
            {
              user?.profile?.skills && user?.profile?.skills.length > 0 
                ? user?.profile?.skills.map((item, index) => {
                    // Parse stringified array if needed with error handling
                    let skill = item;
                    if (typeof item === 'string' && item.startsWith('[')) {
                      try {
                        const parsed = JSON.parse(item);
                        skill = Array.isArray(parsed) ? parsed[0] : item;
                      } catch (e) {
                        // If parsing fails, use the original string
                        skill = item.replace(/[\[\]"]/g, ''); // Remove brackets and quotes
                      }
                    }
                    return <Badge key={index}>{skill}</Badge>;
                  }) 
                : <span>No skills added</span>
            }
          </div>

        </div>
        <div className='grid w-full max-w-sm items-center gap-1.5'>

          <Label className="text-md font-bold" >Resume</Label>
          {
            isResume ? (
              <a 
                target='_blank' 
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(user?.profile?.resume)}&embedded=true`}
                className='text-blue-500 w-full hover:underline cursor-pointer'
              >
                {user?.profile?.resumeOriginalName}
              </a>
            ) : <span>NA</span>
          }

        </div>
      </div>
      <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
        <h1 className='font-bold text-lg'>Applied jobs</h1>
        <AppliedJobTable />
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Profile