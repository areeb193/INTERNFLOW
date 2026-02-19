# Backend Authentication & Image Upload Implementation Guide

This guide explains how this job portal project implements **backend authentication with role-based access control (RBAC)** and **image upload system**, differentiating between **Student** and **Recruiter** roles. Use this guide to implement the same pattern in a **Real Estate Website** with **User** and **Admin** roles.

---

## 📋 Table of Contents

1. [Current Implementation Overview (Job Portal)](#current-implementation-overview)
2. [Authentication System](#authentication-system)
3. [Image Upload System](#image-upload-system)
4. [Role-Based Access Control](#role-based-access-control)
5. [Adapting to Real Estate Project](#adapting-to-real-estate-project)
6. [Code Examples & Patterns](#code-examples--patterns)
7. [Security Best Practices](#security-best-practices)

---

## 🎯 Current Implementation Overview

### Project Structure
```
backend/
├── models/
│   ├── user.model.js          # User schema with role enum
│   ├── company.model.js       # Recruiter's company data
│   └── application.model.js   # Student's job applications
├── controllers/
│   ├── user.controller.js     # Auth & profile updates
│   └── company.controller.js  # Recruiter company management
├── middlewares/
│   ├── isAuthenticated.js     # JWT verification
│   └── multer.js             # File upload handling
├── utils/
│   ├── cloudinary.js         # Cloud storage config
│   └── datauri.js            # File to URI converter
└── routes/
    ├── user.route.js         # Public & protected user routes
    └── company.route.js      # Recruiter-only routes
```

---

## 🔐 Authentication System

### 1. User Model Schema

```javascript
// backend/models/user.model.js
{
    fullname: String (required),
    email: String (required, unique),
    phoneNumber: Number,
    password: String (hashed with bcrypt),
    role: {
        type: String,
        enum: ['student', 'recruiter'],  // ⚠️ KEY DIFFERENTIATOR
        required: true
    },
    profile: {
        bio: String,
        skills: [String],
        resume: [String],              // Cloudinary URLs (student only)
        resumeOriginalName: [String],
        company: ObjectId,             // Reference to Company (recruiter only)
        profilePicture: String         // Cloudinary URL (both roles)
    },
    timestamps: true
}
```

**Key Points:**
- Role is set during registration and cannot be changed
- Profile object stores different data based on role
- Students: `resume`, `skills`, `bio`
- Recruiters: `company` reference, `profilePicture`

---

### 2. Registration Flow

```javascript
// backend/controllers/user.controller.js
export const register = async (req, res) => {
    const { fullname, email, phoneNumber, password, role } = req.body;
    const file = req.file;  // Profile picture (optional)
    
    // Step 1: Validate required fields
    if (!fullname || !email || !phoneNumber || !password || !role) {
        return res.status(400).json({ message: 'All fields required' });
    }
    
    // Step 2: Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    // Step 3: Upload profile picture to Cloudinary (if provided)
    let cloudResponse = null;
    if (file) {
        const fileUri = getDataUri(file);
        const emailPrefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
        cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            folder: "profile-photos",
            public_id: `profile_${emailPrefix}_${Date.now()}`,
            overwrite: true
        });
    }
    
    // Step 4: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Step 5: Create user with role
    const userData = {
        fullname,
        email,
        phoneNumber,
        password: hashedPassword,
        role,  // 'student' or 'recruiter'
        profile: {
            profilePicture: cloudResponse?.secure_url || ""
        }
    };
    
    await User.create(userData);
    return res.status(201).json({ message: 'User registered successfully' });
};
```

**Registration Route:**
```javascript
// backend/routes/user.route.js
router.post('/register', singleUpload, register);
// singleUpload = multer middleware for handling file upload
```

---

### 3. Login Flow with Role Verification

```javascript
// backend/controllers/user.controller.js
export const login = async (req, res) => {
    const { email, password, role } = req.body;
    
    // Step 1: Find user by email
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Step 2: Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Step 3: Verify role matches (CRITICAL)
    if (user.role !== role) {
        return res.status(403).json({ 
            message: 'Access denied for this role' 
        });
    }
    
    // Step 4: Generate JWT token
    const tokenData = { UserId: user._id };
    const token = jwt.sign(
        tokenData, 
        process.env.SECRET_KEY, 
        { expiresIn: '7d' }
    );
    
    // Step 5: Return token in HTTP-only cookie
    return res.status(200)
        .cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        })
        .json({
            message: `Login successful`,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                profile: user.profile
            }
        });
};
```

**Why Role Verification in Login?**
- Prevents students from accessing recruiter dashboard
- Prevents recruiters from accessing student features
- Frontend chooses login type → backend enforces it

---

### 4. Authentication Middleware

```javascript
// backend/middlewares/isAuthenticated.js
const isAuthenticated = (req, res, next) => {
    try {
        // Step 1: Extract token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ 
                message: 'Unauthorized access' 
            });
        }
        
        // Step 2: Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        // Step 3: Attach user ID to request object
        req.id = decoded.UserId;
        next();  // Proceed to next middleware/controller
        
    } catch (error) {
        return res.status(401).json({ 
            message: 'Invalid or expired token' 
        });
    }
};

export default isAuthenticated;
```

**Usage in Routes:**
```javascript
// Protected routes require authentication
router.post('/profile/update', isAuthenticated, multipleUpload, updateProfile);
router.post('/company/register', isAuthenticated, registerCompany);
```

---

## 🖼️ Image Upload System

### 1. Multer Configuration

```javascript
// backend/middlewares/multer.js
import multer from 'multer';

// Use memory storage (files stored in RAM temporarily)
const storage = multer.memoryStorage();

// Single file upload (e.g., profile picture, company logo)
export const singleUpload = multer({ storage }).single('file');

// Multiple file uploads (e.g., resume + profile photo)
export const multipleUpload = multer({ storage }).fields([
    { name: 'file', maxCount: 1 },           // Resume PDF
    { name: 'profilePhoto', maxCount: 1 }    // Profile photo
]);
```

**Why Memory Storage?**
- Files are not saved to disk
- Converted to buffer → uploaded to Cloudinary
- More secure, no cleanup needed

---

### 2. Cloudinary Configuration

```javascript
// backend/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export default cloudinary;
```

**Environment Variables (.env):**
```env
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
SECRET_KEY=your_jwt_secret_key
```

---

### 3. DataURI Converter

```javascript
// backend/utils/datauri.js
import DataURIParser from 'datauri/parser.js';
import path from 'path';

const getDataUri = (file) => {
    const parser = new DataURIParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
};

export default getDataUri;
```

**Purpose:** Converts buffer to base64 data URI for Cloudinary upload

---

### 4. Profile Update with Image Uploads

```javascript
// backend/controllers/user.controller.js
export const updateProfile = async (req, res) => {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id;  // From isAuthenticated middleware
    
    // Handle multiple files
    const resumeFile = req.files?.file?.[0];
    const profilePhotoFile = req.files?.profilePhoto?.[0];
    
    let resumeCloudResponse = null;
    let profilePhotoCloudResponse = null;
    
    // Upload resume (Students only)
    if (resumeFile) {
        const resumeFileUri = getDataUri(resumeFile);
        resumeCloudResponse = await cloudinary.uploader.upload(
            resumeFileUri.content,
            {
                resource_type: "raw",  // For PDFs
                folder: "resumes"
            }
        );
    }
    
    // Upload profile photo (Both roles)
    if (profilePhotoFile) {
        const user = await User.findById(userId);
        const emailPrefix = user.email.split('@')[0]
            .replace(/[^a-zA-Z0-9]/g, '_');
        
        const profilePhotoUri = getDataUri(profilePhotoFile);
        profilePhotoCloudResponse = await cloudinary.uploader.upload(
            profilePhotoUri.content,
            {
                resource_type: "image",
                folder: "profile-photos",
                public_id: `profile_${emailPrefix}_${Date.now()}`,
                overwrite: true
            }
        );
    }
    
    // Update user profile
    const updateData = { fullname, email, phoneNumber };
    updateData.profile = {
        bio,
        skills: skills?.split(',').map(s => s.trim()),
        ...(resumeCloudResponse && {
            resume: resumeCloudResponse.secure_url,
            resumeOriginalName: resumeFile.originalname
        }),
        ...(profilePhotoCloudResponse && {
            profilePicture: profilePhotoCloudResponse.secure_url
        })
    };
    
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true
    });
    
    return res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser
    });
};
```

**Route:**
```javascript
router.post('/profile/update', isAuthenticated, multipleUpload, updateProfile);
```

---

### 5. Company Logo Upload (Recruiters Only)

```javascript
// backend/controllers/company.controller.js
export const updateCompany = async (req, res) => {
    const companyId = req.params.id;
    const { name, description, website, location } = req.body;
    
    let updateData = { name, description, website, location };
    
    // Upload company logo
    if (req.file) {
        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(
            fileUri.content,
            {
                folder: "company-logos"
            }
        );
        updateData.logo = cloudResponse.secure_url;
    }
    
    const company = await Company.findByIdAndUpdate(
        companyId, 
        updateData, 
        { new: true }
    );
    
    return res.status(200).json({
        message: 'Company updated successfully',
        company
    });
};
```

**Route (Recruiter Access Only):**
```javascript
// backend/routes/company.route.js
router.put('/update/:id', isAuthenticated, singleUpload, updateCompany);
```

**Note:** While the route is protected by `isAuthenticated`, actual role checking happens implicitly:
- Only recruiters create companies (via `userId` in company model)
- Students cannot access company features in frontend

---

## 🎭 Role-Based Access Control

### Current Implementation (Job Portal)

| Feature | Student | Recruiter |
|---------|---------|-----------|
| **Registration** | ✅ Upload profile picture | ✅ Upload profile picture |
| **Profile Update** | ✅ Upload resume (PDF)<br>✅ Upload profile photo<br>✅ Update bio, skills | ✅ Upload profile photo<br>✅ Update bio |
| **Company Management** | ❌ Cannot create/update | ✅ Create company<br>✅ Upload company logo |
| **Job Posting** | ❌ Cannot post jobs | ✅ Post jobs with images |
| **Job Applications** | ✅ Apply to jobs | ❌ Cannot apply |
| **View Applications** | ✅ View own applications | ✅ View applications to their jobs |

### Implementation Pattern

**Implicit Role Checking:**
```javascript
// Company registration is implicitly recruiter-only
// because students don't have UI to access this
export const registerCompany = async (req, res) => {
    const userId = req.id;  // From JWT token
    
    await Company.create({
        name: req.body.companyName,
        userId: userId  // Links to recruiter
    });
};
```

**Explicit Role Checking (Optional Enhancement):**
```javascript
// Middleware to check specific roles
const authorizeRole = (...allowedRoles) => {
    return async (req, res, next) => {
        const user = await User.findById(req.id);
        
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: `Access denied. Only ${allowedRoles.join(', ')} allowed.`
            });
        }
        
        next();
    };
};

// Usage
router.post('/company/register', 
    isAuthenticated, 
    authorizeRole('recruiter'),  // Only recruiters
    registerCompany
);
```

---

## 🏠 Adapting to Real Estate Project

### Role Mapping

| Job Portal | Real Estate |
|------------|-------------|
| **Student** → | **User** (Property seeker) |
| **Recruiter** → | **Admin** (Property manager) |

---

### 1. User Model for Real Estate

```javascript
// models/user.model.js (Real Estate version)
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],  // Changed from student/recruiter
        required: true,
        default: 'user'
    },
    profile: {
        profilePicture: {
            type: String,
            default: ""
        },
        // User-specific fields
        savedProperties: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property'
        }],
        // Admin-specific fields
        agency: {
            type: String
        },
        licenseNumber: {
            type: String
        }
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
```

---

### 2. Property Model

```javascript
// models/property.model.js
const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        address: String,
        city: String,
        state: String,
        zipCode: String
    },
    propertyType: {
        type: String,
        enum: ['apartment', 'house', 'condo', 'land'],
        required: true
    },
    images: [{
        url: String,           // Cloudinary URLs
        publicId: String       // For deletion
    }],
    floorPlan: {
        url: String,
        publicId: String
    },
    documents: [{
        url: String,
        filename: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'pending'],
        default: 'available'
    }
}, { timestamps: true });

export const Property = mongoose.model('Property', propertySchema);
```

---

### 3. Registration Flow (Real Estate)

```javascript
// controllers/user.controller.js
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        
        // Validation
        if (!fullname || !email || !phoneNumber || !password) {
            return res.status(400).json({ 
                message: 'All fields required' 
            });
        }
        
        // Default role is 'user' if not specified
        const userRole = role || 'user';
        
        // Only allow 'user' role in public registration
        // Admins should be created through separate admin panel
        if (userRole === 'admin') {
            return res.status(403).json({
                message: 'Cannot register as admin publicly'
            });
        }
        
        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists' 
            });
        }
        
        // Handle profile picture upload
        let cloudResponse = null;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const emailPrefix = email.split('@')[0]
                .replace(/[^a-zA-Z0-9]/g, '_');
            
            cloudResponse = await cloudinary.uploader.upload(
                fileUri.content,
                {
                    folder: "user-profiles",
                    public_id: `user_${emailPrefix}_${Date.now()}`,
                    overwrite: true
                }
            );
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const userData = {
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role: userRole,
            profile: {
                profilePicture: cloudResponse?.secure_url || ""
            }
        };
        
        await User.create(userData);
        
        return res.status(201).json({
            message: 'User registered successfully',
            success: true
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
};
```

---

### 4. Property Creation (Admin Only)

```javascript
// controllers/property.controller.js
export const createProperty = async (req, res) => {
    try {
        const adminId = req.id;  // From JWT
        
        // Verify user is admin
        const user = await User.findById(adminId);
        if (user.role !== 'admin') {
            return res.status(403).json({
                message: 'Only admins can create properties'
            });
        }
        
        const { title, description, price, location, propertyType } = req.body;
        
        // Handle multiple image uploads
        const imageFiles = req.files;  // Array of files
        let uploadedImages = [];
        
        if (imageFiles && imageFiles.length > 0) {
            for (let file of imageFiles) {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(
                    fileUri.content,
                    {
                        folder: "properties",
                        transformation: [
                            { width: 1200, height: 800, crop: 'fill' },
                            { quality: 'auto' }
                        ]
                    }
                );
                
                uploadedImages.push({
                    url: cloudResponse.secure_url,
                    publicId: cloudResponse.public_id
                });
            }
        }
        
        // Create property
        const property = await Property.create({
            title,
            description,
            price,
            location,
            propertyType,
            images: uploadedImages,
            createdBy: adminId
        });
        
        return res.status(201).json({
            message: 'Property created successfully',
            property
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};
```

---

### 5. Route Configuration (Real Estate)

```javascript
// routes/user.route.js
import express from 'express';
import { register, login, updateProfile, logout } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/register', singleUpload, register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/profile/update', isAuthenticated, singleUpload, updateProfile);

export default router;
```

```javascript
// routes/property.route.js
import express from 'express';
import { 
    createProperty, 
    updateProperty, 
    deleteProperty,
    getAllProperties,
    getPropertyById
} from '../controllers/property.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { multipleUpload } from '../middlewares/multer.js';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Admin-only routes
router.post('/create', 
    isAuthenticated, 
    authorizeRole('admin'),
    multipleUpload,
    createProperty
);

router.put('/update/:id',
    isAuthenticated,
    authorizeRole('admin'),
    multipleUpload,
    updateProperty
);

router.delete('/delete/:id',
    isAuthenticated,
    authorizeRole('admin'),
    deleteProperty
);

export default router;
```

---

### 6. Role Authorization Middleware

```javascript
// middlewares/authorizeRole.js
import { User } from '../models/user.model.js';

export const authorizeRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.id;  // From isAuthenticated middleware
            
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({
                    message: 'User not found',
                    success: false
                });
            }
            
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    message: `Access denied. Only ${allowedRoles.join(' or ')} can access this resource.`,
                    success: false
                });
            }
            
            // Attach user to request for further use
            req.user = user;
            next();
            
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(500).json({
                message: 'Server error',
                success: false
            });
        }
    };
};
```

---

### 7. Multer Configuration for Multiple Images

```javascript
// middlewares/multer.js
import multer from 'multer';

const storage = multer.memoryStorage();

// Single file upload
export const singleUpload = multer({ storage }).single('file');

// Multiple property images (up to 10)
export const multipleUpload = multer({ storage }).array('images', 10);

// Mixed uploads (images + documents)
export const mixedUpload = multer({ storage }).fields([
    { name: 'images', maxCount: 10 },
    { name: 'floorPlan', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
]);
```

---

## 📝 Code Examples & Patterns

### Complete User Registration Example

```javascript
// Frontend: Sending registration request
const handleRegister = async (formData) => {
    const data = new FormData();
    data.append('fullname', formData.fullname);
    data.append('email', formData.email);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('password', formData.password);
    data.append('role', 'user');  // or 'admin'
    
    if (formData.profilePicture) {
        data.append('file', formData.profilePicture);  // File object
    }
    
    const response = await axios.post('/api/user/register', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
```

### Complete Property Creation Example

```javascript
// Frontend: Creating property with multiple images
const handleCreateProperty = async (propertyData) => {
    const formData = new FormData();
    formData.append('title', propertyData.title);
    formData.append('description', propertyData.description);
    formData.append('price', propertyData.price);
    formData.append('propertyType', propertyData.propertyType);
    formData.append('location', JSON.stringify(propertyData.location));
    
    // Append multiple images
    propertyData.images.forEach((image) => {
        formData.append('images', image);  // Multiple files with same key
    });
    
    const response = await axios.post('/api/property/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true  // Include cookies (JWT token)
    });
};
```

### Image Deletion from Cloudinary

```javascript
// controllers/property.controller.js
export const deleteProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const userId = req.id;
        
        const property = await Property.findById(propertyId);
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        
        // Verify ownership (admin who created it)
        if (property.createdBy.toString() !== userId) {
            return res.status(403).json({ 
                message: 'Not authorized to delete this property' 
            });
        }
        
        // Delete images from Cloudinary
        if (property.images && property.images.length > 0) {
            for (let image of property.images) {
                await cloudinary.uploader.destroy(image.publicId);
            }
        }
        
        // Delete property from database
        await Property.findByIdAndDelete(propertyId);
        
        return res.status(200).json({
            message: 'Property deleted successfully'
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
```

---

## 🔒 Security Best Practices

### 1. Password Security
```javascript
// Use bcrypt with sufficient salt rounds
const hashedPassword = await bcrypt.hash(password, 10);  // 10 rounds minimum
```

### 2. JWT Security
```javascript
// HTTP-only cookies prevent XSS attacks
res.cookie("token", token, {
    httpOnly: true,           // Cannot be accessed via JavaScript
    secure: true,             // HTTPS only in production
    sameSite: 'strict',       // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000
});
```

### 3. File Upload Validation
```javascript
// Add to multer configuration
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and PDF allowed.'), false);
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB max
    }
});
```

### 4. Input Sanitization
```javascript
// Install: npm install express-validator
import { body, validationResult } from 'express-validator';

router.post('/register',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('fullname').trim().escape(),
        body('phoneNumber').isNumeric()
    ],
    singleUpload,
    register
);
```

### 5. Rate Limiting
```javascript
// Install: npm install express-rate-limit
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5,                     // 5 requests per window
    message: 'Too many login attempts, please try again later'
});

router.post('/login', authLimiter, login);
```

### 6. Environment Variables
```env
# .env file
SECRET_KEY=your_super_secret_jwt_key_minimum_32_characters
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
MONGO_URI=mongodb://localhost:27017/realestate
PORT=8000
NODE_ENV=production
```

### 7. CORS Configuration
```javascript
// In main server file (index.js)
import cors from 'cors';

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true  // Allow cookies
}));
```

---

## 🎯 Implementation Checklist for Real Estate Project

### Backend Setup
- [ ] Create user model with `role: ['user', 'admin']`
- [ ] Create property model with image arrays
- [ ] Install dependencies: `multer`, `cloudinary`, `bcrypt`, `jsonwebtoken`
- [ ] Configure Cloudinary credentials
- [ ] Create authentication middleware (`isAuthenticated`)
- [ ] Create role authorization middleware (`authorizeRole`)
- [ ] Set up multer for single and multiple file uploads

### Authentication
- [ ] Implement user registration with profile picture upload
- [ ] Implement login with role verification
- [ ] Implement logout
- [ ] Protect routes with `isAuthenticated` middleware
- [ ] Add role-based access control to admin routes

### Image Upload
- [ ] Create DataURI converter utility
- [ ] Implement profile picture upload (users + admins)
- [ ] Implement property image uploads (admins only)
- [ ] Add image validation (type, size)
- [ ] Implement image deletion when property is deleted

### Property Management
- [ ] Create property routes (public + admin-only)
- [ ] Implement property creation with multiple images
- [ ] Implement property update (only by creator)
- [ ] Implement property deletion (with Cloudinary cleanup)
- [ ] Add property listing for users

### Security
- [ ] Hash passwords with bcrypt
- [ ] Use HTTP-only cookies for JWT
- [ ] Add rate limiting to auth routes
- [ ] Validate and sanitize inputs
- [ ] Add file type and size validation
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets

### Testing
- [ ] Test user registration (with/without image)
- [ ] Test login with different roles
- [ ] Test protected routes without token
- [ ] Test admin-only routes with user account
- [ ] Test property creation with multiple images
- [ ] Test image upload size limits
- [ ] Test invalid file type rejection

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install express mongoose bcrypt jsonwebtoken cookie-parser
npm install multer cloudinary datauri
npm install cors dotenv

# Create folder structure
mkdir -p backend/{models,controllers,middlewares,utils,routes}

# Run development server
npm run dev
```

---

## 📚 Key Takeaways

1. **Role Differentiation**: Set during registration, enforced in login and protected routes
2. **Image Upload**: Multer → Memory Buffer → DataURI → Cloudinary → Store URL in DB
3. **Authentication**: JWT in HTTP-only cookies, verified by middleware
4. **Authorization**: Role-based access via middleware checking user role
5. **Security**: Hash passwords, validate files, rate limit, sanitize inputs
6. **Real Estate Mapping**: `student → user`, `recruiter → admin`

---

**This guide provides the complete pattern for implementing authentication with role-based access and image uploads. Follow the structure, adapt the models, and implement the same middleware chain for your real estate project.**
