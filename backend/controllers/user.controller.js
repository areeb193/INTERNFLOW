import {User} from '../models/user.model.js';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { OAuth2Client } from 'google-auth-library';

// Google OAuth Client with your specific Client ID
const client = new OAuth2Client("990128340658-ldli8m2948al9pu0rmhos95tlo6v0v99.apps.googleusercontent.com");

export const register = async (req, res) => {
  try {
    const { fullname, email ,phoneNumber, password,role } = req.body;
    
    
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: 'All fields are required',  success: false  });
    }
    const file = req.file;
    let cloudResponse = null;
    
    if (file) {
      const fileUri = getDataUri(file);
      // Use email-based naming for consistent retrieval
      const emailPrefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
      cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "profile-photos",
        public_id: `profile_${emailPrefix}_${Date.now()}`,
        overwrite: true
      });
      
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists', success: false });
    }
    const hashedPassword = await bycrypt.hash(password, 10);
    const userData = {
      fullname,
      email,
      phoneNumber: Number(phoneNumber),
      password: hashedPassword,
      role,
    };
    
    if (cloudResponse) {
      userData.profile = {
        profilePicture: cloudResponse.secure_url,
      };
    }
    
    await User.create(userData);
    return res.status(201).json({ message: 'User registered successfully', success: true });   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error: ' + error.message, success: false });
  }

};

export const login = async (req, res) => {
    try {
        const { email, password , role  } = req.body;
        
        
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email and password are required', success: false });
        }
        let user = await User.findOne({ email });
        
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }
        
        const isPasswordMatch = await bycrypt.compare(password, user.password);
        
        
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }
        
        if (user.role !== role) {
            return res.status(403).json({ message: 'Access denied for this role', success: false });
        }
        const tokenData = {
            UserId: user._id,
            
        }
        const token = await  jwt.sign(tokenData, process.env.SECRET_KEY || 'fallback-secret-key', { expiresIn: '7d' });
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000, httpOnly: true, secure: process.env.NODE_ENV === 'production'}).json({
            message: `Login successful ${user.fullname}`,
            user,
            success: true,})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
    }


    export const logout = async (req, res) => {
        try {
            return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, secure: 'strict' }).json({
                message: 'Logout successful',
                success: true,
                });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', success: false });
        }
    }

        export const updateProfile = async (req, res) => {
    try {
            const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        // Handle multiple files (resume and profile photo)
        const resumeFile = req.files?.file?.[0];
        const profilePhotoFile = req.files?.profilePhoto?.[0];
        
        let resumeCloudResponse = null;
        let profilePhotoCloudResponse = null;
        
        // Upload resume to Cloudinary if provided
        if (resumeFile) {
            const resumeFileUri = getDataUri(resumeFile);
            resumeCloudResponse = await cloudinary.uploader.upload(resumeFileUri.content, {
                resource_type: "raw",
                folder: "resumes"
            });
        }
        
        // Upload profile photo to Cloudinary if provided
        if (profilePhotoFile) {
            const userId = req.id;
            const user = await User.findById(userId);
            const emailPrefix = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
            
            const profilePhotoUri = getDataUri(profilePhotoFile);
            profilePhotoCloudResponse = await cloudinary.uploader.upload(profilePhotoUri.content, {
                resource_type: "image",
                folder: "profile-photos",
                public_id: `profile_${emailPrefix}_${Date.now()}`,
                overwrite: true,
                transformation: [
                    { width: 500, height: 500, crop: "limit" },
                    { quality: "auto" }
                ]
            });
        }

        if (!fullname || !email) {
                return res.status(400).json({ 
                    message: 'Fullname and email are required',
                     success: false });
            };

            let skillArray = [];
            if (skills) {
                skillArray = skills.split(',').map(s => s.trim()).filter(s => s);
            }

            const userId= req.id;
            let user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found', success: false });
            }

            if(fullname) user.fullname = fullname;
            if(email) user.email = email;
            if(phoneNumber) user.phoneNumber = Number(phoneNumber);
            
            // Update profile object
            if (!user.profile) {
                user.profile = {};
            }
            if(bio) user.profile.bio = bio;
            if(skillArray && skillArray.length > 0) user.profile.skills = skillArray;
            
            // Update resume if uploaded
            if (resumeCloudResponse){
                user.profile.resume = resumeCloudResponse.secure_url;
                user.profile.resumeOriginalName = resumeFile.originalname;
            }
            
            // Update profile photo if uploaded
            if (profilePhotoCloudResponse) {
                user.profile.profilePicture = profilePhotoCloudResponse.secure_url;
            }
            
            await user.save();
             user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }
            return res.status(200).json({ message: 'Profile updated successfully', success: true, user });
        } catch (error) {
            console.error('Profile update error:', error);
            res.status(500).json({ message: 'Server error: ' + error.message, success: false });
        }
    }

export const googleLogin = async (req, res) => {
    try {
        const { idToken, role } = req.body;

        // 1. Verify the token with Google
        const ticket = await client.verifyIdToken({
            idToken,
            audience: "990128340658-ldli8m2948al9pu0rmhos95tlo6v0v99.apps.googleusercontent.com",
        });
        
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        console.log('Google Login - Email:', email);

        // 2. Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            console.log('Creating new Google user:', email);
            // 3. Create new user if they don't exist - use Google picture as default
            user = await User.create({
                fullname: name,
                email,
                role: role || 'student', 
                profile: {
                    profilePicture: picture || '',
                }
            });
        } else {
            console.log('Existing user found:', email);
            console.log('Current profile picture:', user.profile?.profilePicture);
        }
        
        // Always fetch fresh user data from database to ensure latest profile photo
        user = await User.findOne({ email });
        
        if (!user.profile) {
            user.profile = { profilePicture: '' };
        }

        console.log('Returning profile picture:', user.profile.profilePicture);

        // 4. Generate JWT Token (Same logic as your normal login)
        const tokenData = {
            UserId: user._id,
        };
        
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY || 'fallback-secret-key', { expiresIn: '7d' });

        // 5. Prepare user object (same format as regular login)
        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        // 6. Send Response
        return res.status(200).cookie("token", token, { 
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production'
        }).json({
            message: `Welcome ${userResponse.fullname}`,
            user: userResponse,
            success: true
        });

    } catch (error) {
        console.error('Google authentication error:', error);
        return res.status(500).json({
            message: "Google authentication failed",
            success: false
        });
    }
};
