import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '../utils/constant'
import { toast } from 'sonner'
import { setUser } from '../redux/authSlice'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'


const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const [input, setInput] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        bio: '',
        skills: '',
        file: '',
        profilePhoto: ''
    });
    const [profilePhotoPreview, setProfilePhotoPreview] = useState('');

    useEffect(() => {
        if (open) {
            console.log('Dialog opened. User data:', user);
            console.log('User profile:', user?.profile); 
            
            // Use actual user data or test data for demonstration
            const userData = user || {
                fullname: 'John Doe',
                email: 'john@example.com',
                phoneNumber: '123-456-7890',
                profile: {
                    bio: 'I am a passionate developer with experience in React and Node.js',
                    skills: ['JavaScript', 'React', 'Node.js', 'CSS']
                }
            };
            
            setInput({
                fullname: userData?.fullname || '',
                email: userData?.email || '',
                phoneNumber: userData?.phoneNumber || '',
                bio: userData?.profile?.bio || '',
                skills: userData?.profile?.skills ? (Array.isArray(userData.profile.skills) ? userData.profile.skills.join(', ') : userData.profile.skills) : '',
                file: '',
                profilePhoto: ''
            });
            
            // Set current profile photo as preview
            setProfilePhotoPreview(userData?.profile?.profilePicture || '');
        }
    }, [user, open]);

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        // Send skills as comma-separated string
        formData.append("skills", input.skills);
        
        // Add resume file if selected
        if (input.file) {
            formData.append("file", input.file);
        }
        
        // Add profile photo if selected
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        
        try {
            setLoading(true);
            console.log('Submitting form data:', formData);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                // Update Redux store with new user data
                dispatch(setUser(res.data.user));
                toast.success(res.data.message || 'Profile updated successfully!');
                setOpen(false);
            }
        } catch (error) {
            console.error('Profile update failed:', error);
            toast.error(error.response?.data?.message || 'Profile update failed');
        } finally {
            setLoading(false);
        }
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({
            ...input,
            file: file
        });
    };
    
    const profilePhotoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            
            setInput({
                ...input,
                profilePhoto: file
            });
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const removeProfilePhoto = () => {
        setInput({
            ...input,
            profilePhoto: ''
        });
        setProfilePhotoPreview(user?.profile?.profilePicture || '');
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information and upload your photo and resume.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submitHandler} className="grid gap-4 py-4">
                    {/* Profile Photo Upload Section */}
                    <div className="flex flex-col items-center gap-3 pb-4 border-b">
                        <Label className="text-sm font-semibold">Profile Photo</Label>
                        <div className="relative">
                            <Avatar className="w-24 h-24 ring-2 ring-offset-2 ring-gray-200">
                                <AvatarImage src={profilePhotoPreview} alt="Profile" />
                                <AvatarFallback className="text-2xl">
                                    {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            {input.profilePhoto && (
                                <button
                                    type="button"
                                    onClick={removeProfilePhoto}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Label
                                htmlFor="profilePhoto"
                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6A38C2] to-[#F83002] text-white rounded-md hover:opacity-90 transition-opacity"
                            >
                                <Upload className="w-4 h-4" />
                                {input.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                            </Label>
                            <Input
                                id="profilePhoto"
                                type="file"
                                accept="image/*"
                                onChange={profilePhotoChangeHandler}
                                className="hidden"
                            />
                        </div>
                        <p className="text-xs text-gray-500 text-center">JPG, PNG or GIF (Max 5MB)</p>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="fullname"
                            value={input.fullname}
                            onChange={changeEventHandler}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            name="phoneNumber"
                            value={input.phoneNumber}
                            onChange={changeEventHandler}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bio" className="text-right">
                            Bio
                        </Label>
                        <Input
                            id="bio"
                            name="bio"
                            value={input.bio}
                            onChange={changeEventHandler}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Skills" className="text-right">
                            Skills
                        </Label>
                        <Input
                            id="Skills"
                            name="skills"
                            value={input.skills}
                            onChange={changeEventHandler}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right">
                            Resume
                        </Label>
                        <Input
                            id="file"
                            name="file"
                            type="file"
                            onChange={fileChangeHandler}
                            accept="application/pdf"
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        {
                            loading ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' /> please wait </Button> : <button type='submit' className='w-full my-4 bg-black text-amber-50'>update</button>
                        }
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog