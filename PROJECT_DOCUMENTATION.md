# Job Portal - Full Stack MERN Application

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Recent Updates & New Features](#recent-updates--new-features)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Database Schema](#database-schema)
6. [Backend Architecture](#backend-architecture)
7. [Frontend Architecture](#frontend-architecture)
8. [Google OAuth Authentication](#-google-oauth-authentication)
9. [UI/UX Enhancements](#-uiux-enhancements)
10. [API Endpoints Documentation](#api-endpoints-documentation)
11. [Features & Functionality](#features--functionality)
12. [Authentication Flow](#authentication-flow)
13. [Real-time Chat Implementation](#real-time-chat-implementation)
14. [External Job Search Integration](#external-job-search-integration)
15. [Testing Guide](#testing-guide)
16. [Deployment Guide](#deployment-guide)
17. [Known Issues & Fixes](#known-issues--fixes)

---

## 🆕 Recent Updates & New Features

### Version 1.1.0 (February 2026)

#### 🔐 Authentication Enhancements
- **Google OAuth 2.0 Integration**
  - Sign in with Google functionality
  - Automatic user creation for new Google users
  - Profile picture sync from Google accounts
  - No password required for OAuth users
  - Libraries: `@react-oauth/google`, `google-auth-library`

#### 🎨 UI/UX Improvements
- **LoadingSpinner Component**
  - Custom branded loading animation
  - Multi-layer animations with brand colors
  - Used during app initialization and data loading
  
- **ErrorBoundary Component**
  - Graceful error handling
  - Prevents app crashes
  - User-friendly error messages with recovery options

- **Enhanced Animations**
  - Integration with anime.js for smooth transitions
  - Improved loading states across components

#### 🔌 Architecture Updates
- **SocketContext Provider**
  - Centralized WebSocket management
  - Global Socket.IO connection handling
  - Connection state tracking
  - Improved chat room management

#### 📦 Dependency Updates
- React upgraded to v19
- React Router DOM upgraded to v7
- Tailwind CSS with Vite plugin
- Updated all shadcn/ui components
- Latest Socket.IO client

#### 🛠️ Developer Experience
- Improved error logging
- Better TypeScript support setup
- Enhanced development environment configuration
- Minikube configured for local Kubernetes testing

---

## 🎯 Project Overview

A comprehensive **Job Portal** platform built using the MERN stack that connects **students/job seekers** with **recruiters**. The platform enables job posting, application management, real-time chat communication, and external job search integration.

### Key Features:
- **Dual User Roles**: Student and Recruiter
- **Google OAuth Authentication**: Sign in with Google for quick access
- **Job Management**: Post, browse, and apply for jobs
- **Application Tracking**: Track application status (applied, interviewed, offered, rejected)
- **Real-time Chat**: Socket.IO powered communication between students and recruiters
- **External Job Search**: Integration with JSearch RapidAPI for external job listings
- **Profile Management**: User profiles with resume upload and skill management
- **Company Management**: Recruiters can manage multiple companies
- **Error Handling**: ErrorBoundary component for graceful error handling
- **Loading States**: Custom LoadingSpinner for better UX
- **Socket Context**: Centralized WebSocket management

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │   React UI  │  │ Redux Store  │  │  Socket.IO      │    │
│  │  Components │  │  (State Mgmt)│  │  Client         │    │
│  └─────────────┘  └──────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js/Express)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   REST API   │  │  Socket.IO   │  │   Middleware    │   │
│  │  Controllers │  │    Server    │  │ (Auth, Upload)  │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Mongoose Models & Schema                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                        │
│  ┌───────┐ ┌─────────┐ ┌──────┐ ┌──────────────┐ ┌──────┐ │
│  │ Users │ │Companies│ │ Jobs │ │ Applications │ │ Chats│ │
│  └───────┘ └─────────┘ └──────┘ └──────────────┘ └──────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                               │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │  Cloudinary  │  │  RapidAPI    │                         │
│  │ (File Upload)│  │ (Job Search) │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Technology Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js (v5.1.0)
- **Database**: MongoDB (Mongoose ODM v8.16.4)
- **Authentication**: JWT (jsonwebtoken v9.0.2) + bcrypt (v6.0.0) + Google OAuth 2.0
- **OAuth Library**: google-auth-library (v10.5.0)
- **Real-time Communication**: Socket.IO (v4.8.1)
- **File Upload**: Multer (v2.0.2) + Cloudinary (v2.7.0)
- **HTTP Client**: Axios (v1.11.0)

### Frontend
- **Framework**: React 19 + Vite
- **State Management**: Redux Toolkit + Redux Persist
- **Routing**: React Router DOM v7
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **HTTP Client**: Axios with interceptors
- **Real-time**: Socket.IO Client
- **Notifications**: Sonner (Toast notifications)
- **Authentication**: @react-oauth/google (v0.13.4)
- **Error Handling**: React ErrorBoundary
- **Animations**: anime.js (v4.1.2)

### Development Tools
- **Development Server**: Nodemon (v3.1.10)
- **Environment Variables**: dotenv (v17.2.0)

---

## 🗄️ Database Schema

### 1. User Model
```javascript
{
  fullname: String (required),
  email: String (required, unique),
  phoneNumber: Number (optional - not required for Google OAuth users),
  password: String (optional - not required for Google OAuth users),
  role: String (enum: ['student', 'recruiter'], required),
  profile: {
    bio: String,
    skills: [String],
    resume: [String], // Cloudinary URLs
    resumeOriginalName: [String],
    company: ObjectId (ref: Company),
    profilePicture: String (default: "" - can be set from Google profile picture)
  },
  timestamps: true
}
```

### 2. Company Model
```javascript
{
  name: String (required, unique),
  description: String,
  website: String,
  location: String,
  logo: String, // Cloudinary URL
  userId: ObjectId (required, ref: User),
  timestamps: true
}
```

### 3. Job Model
```javascript
{
  title: String (required),
  description: String (required),
  requirements: [String],
  salary: String (required),
  location: String (required),
  jobType: String (required),
  experienceLevel: Number (required),
  position: String (required),
  company: ObjectId (required, ref: Company),
  createdBy: ObjectId (required, ref: User),
  applications: [ObjectId (ref: Application)],
  timestamps: true
}
```

### 4. Application Model
```javascript
{
  job: ObjectId (required, ref: Job),
  applicant: ObjectId (required, ref: User),
  status: String (enum: ['applied', 'interviewed', 'offered', 'rejected'], default: 'applied'),
  timestamps: true
}
```

### 5. Chat Model
```javascript
{
  application: ObjectId (required, ref: Application, unique),
  student: ObjectId (required, ref: User),
  recruiter: ObjectId (required, ref: User),
  job: ObjectId (required, ref: Job),
  messages: [{
    sender: ObjectId (ref: User),
    content: String,
    timestamp: Date,
    read: Boolean
  }],
  lastMessage: Date,
  unreadCount: {
    student: Number,
    recruiter: Number
  },
  isActive: Boolean,
  timestamps: true
}
```

### 6. JobHunt Model (External Jobs)
```javascript
{
  userId: ObjectId (required, ref: User),
  searchQuery: {
    city: String (required),
    country: String (required),
    field: String
  },
  searchParams: {
    page: Number,
    numPages: Number
  },
  jobs: [{
    job_id: String,
    employer_name: String,
    job_title: String,
    job_city: String,
    job_country: String,
    job_apply_link: String,
    job_description: String,
    job_employment_type: String,
    job_salary: String,
    job_posted_at_datetime_utc: String
  }],
  searchDate: Date,
  totalResults: Number,
  timestamps: true
}
```

---

## 🔧 Backend Architecture

### Directory Structure
```
backend/
├── index.js                 # Main server file
├── controllers/             # Request handlers
│   ├── user.controller.js
│   ├── company.controller.js
│   ├── job.controller.js
│   ├── application.controller.js
│   ├── chat.controller.js
│   └── jobHunt.controller.js
├── models/                  # Mongoose schemas
│   ├── user.model.js
│   ├── company.model.js
│   ├── job.model.js
│   ├── application.model.js
│   ├── chat.model.js
│   └── jobHunt.model.js
├── routes/                  # API routes
│   ├── user.route.js
│   ├── company.route.js
│   ├── job.route.js
│   ├── application.route.js
│   ├── chat.route.js
│   └── jobHunt.route.js
├── middlewares/             # Custom middleware
│   ├── isAuthenticated.js
│   └── multer.js
└── utils/                   # Utility functions
    ├── cloudinary.js
    ├── datauri.js
    └── db.js
```

### Middleware Breakdown

#### 1. Authentication Middleware (`isAuthenticated.js`)
- **Purpose**: Protects routes requiring user authentication
- **Process**:
  1. Extracts JWT token from cookies
  2. Verifies token using SECRET_KEY
  3. Retrieves user ID and attaches to `req.id`
  4. Returns 401 if token is invalid or missing

#### 2. File Upload Middleware (`multer.js`)
- **Purpose**: Handles file uploads (profile pictures, resumes, logos)
- **Configuration**: Memory storage for temporary file handling
- **Integration**: Works with Cloudinary for cloud storage

### Controllers Overview

#### User Controller
- **register**: Creates new user account with optional profile picture
- **login**: Authenticates user with role-based access
- **googleLogin**: Authenticates users via Google OAuth 2.0 (NEW)
- **logout**: Clears authentication cookie
- **updateProfile**: Updates user profile including resume upload

#### Company Controller
- **registerCompany**: Creates new company (recruiter only)
- **getCompany**: Retrieves all companies for a recruiter
- **getCompanyById**: Gets specific company details
- **updateCompany**: Updates company info and logo

#### Job Controller
- **postJob**: Creates new job posting (recruiter only)
- **getJobs**: Retrieves jobs with keyword search
- **getJobById**: Gets specific job with applications
- **getAdminJobs**: Gets all jobs created by a recruiter
- **getAllJobs**: Retrieves all jobs in the system

#### Application Controller
- **applyJob**: Student applies for a job
- **getAppliedJobs**: Gets all applications by a student
- **getApplicants**: Gets all applicants for a job (recruiter)
- **updateStatus**: Updates application status

#### Chat Controller
- **getChats**: Retrieves all chats for a user
- **getChatByApplication**: Gets chat for specific application
- **createChat**: Creates new chat between student and recruiter
- **sendMessage**: Sends message in a chat
- **markAsRead**: Marks messages as read

#### JobHunt Controller
- **searchJobs**: Searches external jobs via RapidAPI
- **getJobHistory**: Retrieves user's search history
- **getJobSearchById**: Gets specific search results
- **deleteJobSearch**: Deletes search history

---

## 🎨 Frontend Architecture

### Directory Structure
```
frontend/src/
├── App.jsx                  # Main app component with routes
├── main.jsx                 # Entry point
├── components/              # React components
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ProtectedRoute.jsx
│   ├── admin/               # Recruiter components
│   │   ├── Companies.jsx
│   │   ├── CompanyCreate.jsx
│   │   ├── CompanySetup.jsx
│   │   ├── Adminjobs.jsx
│   │   ├── PostJob.jsx
│   │   └── Applicants.jsx
│   ├── chat/
│   │   ├── ChatButton.jsx
│   │   └── ChatPopup.jsx
│   ├── shared/
│   │   └── Navbar.jsx
│   ├── ui/                  # shadcn/ui components
│   ├── ErrorBoundary.jsx    # Error boundary for graceful error handling
│   ├── LoadingSpinner.jsx   # Custom loading component
│   └── ... (other components)
├── contexts/
│   └── SocketContext.jsx    # Socket.IO context provider
├── hooks/                   # Custom React hooks
│   ├── useGetAllJobs.jsx
│   ├── useGetAppliedjobs.jsx
│   └── useGetAllCompanies.jsx
├── redux/                   # State management
│   ├── store.js
│   ├── authSlice.js
│   ├── jobSlice.js
│   ├── companySlice.js
│   ├── applicationSlice.js
│   ├── chatSlice.js
│   └── jobHuntSlice.js
└── utils/
    ├── axiosConfig.js       # Axios interceptors
    └── constant.js          # API endpoints
```

### State Management (Redux)

#### Auth Slice
```javascript
State: {
  loading: Boolean,
  user: Object | null
}
Actions: setLoading, setUser, logout
```

#### Job Slice
```javascript
State: {
  allJobs: Array,
  singleJob: Object | null,
  adminJobs: Array,
  searchedQuery: String,
  allAdminJobs: Array,
  searchJobByText: String
}
```

#### Company Slice
```javascript
State: {
  singleCompany: Object | null,
  companies: Array,
  searchCompanyByText: String
}
```

#### Application Slice
```javascript
State: {
  applicants: Array,
  applications: Array
}
```

#### Chat Slice
```javascript
State: {
  chats: Array,
  currentChat: Object | null,
  unreadCount: Number
}
```

### React Router Routes

| Route | Component | Protection | Role |
|-------|-----------|------------|------|
| `/` | Home | Public | All |
| `/login` | Login | Public | All |
| `/signup` | Signup | Public | All |
| `/jobs` | Jobs | Protected | All |
| `/browse` | Browse | Protected | All |
| `/description/:id` | JobDescription | Protected | All |
| `/profile` | Profile | Protected | All |
| `/job-hunt` | JobHunt | Protected | Student |
| `/admin/companies` | Companies | Protected | Recruiter |
| `/admin/companies/create` | CompanyCreate | Protected | Recruiter |
| `/admin/companies/:id` | CompanySetup | Protected | Recruiter |
| `/admin/jobs` | Adminjobs | Protected | Recruiter |
| `/admin/jobs/create` | PostJob | Protected | Recruiter |
| `/admin/jobs/:id/applicants` | Applicants | Protected | Recruiter |

---

## � Google OAuth Authentication

### Overview
The application now supports **Google OAuth 2.0** authentication, allowing users to sign in quickly using their Google accounts. This feature is implemented on both frontend and backend.

### Implementation Details

#### Backend Implementation
- **Library**: `google-auth-library` (v10.5.0)
- **Endpoint**: `POST /api/v1/user/google`
- **Client ID**: Configured in environment variables

**googleLogin Controller** (`user.controller.js`):
```javascript
export const googleLogin = async (req, res) => {
  // 1. Verify Google ID token
  // 2. Extract user info (email, name, picture)
  // 3. Create new user or fetch existing user
  // 4. Set profile picture from Google if new user
  // 5. Generate JWT token
  // 6. Return user data with cookie
}
```

**Key Features**:
- Automatic user creation on first Google login
- Profile picture sync from Google account
- Role selection (Student/Recruiter) before sign-in
- Fallback to regular email/password auth
- No password required for Google users
- Phone number optional for Google users

#### Frontend Implementation
- **Library**: `@react-oauth/google` (v0.13.4)
- **Provider**: `GoogleOAuthProvider` wraps entire app
- **Component**: `GoogleLogin` button in Login.jsx

**Login Flow**:
1. User selects role (Student/Recruiter)
2. Clicks "Sign in with Google"
3. Google popup authentication
4. ID token sent to backend
5. User redirected to home page

**Code Example** (`Login.jsx`):
```javascript
<GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => toast.error("Google Login Failed")}
    theme="outline"
  />
</GoogleOAuthProvider>
```

### Environment Variables
```bash
# Backend (.env)
GOOGLE_CLIENT_ID=your-google-client-id

# Frontend (.env)
# Not needed - client ID embedded in code
```

### User Experience
- ✅ Faster authentication (no password required)
- ✅ Automatic profile picture from Google
- ✅ One-click sign-in
- ⚠️ Users must select role before Google sign-in
- ℹ️ Email must match between Google and manual signup

---

## 🎨 UI/UX Enhancements

### 1. LoadingSpinner Component
**Location**: `frontend/src/components/LoadingSpinner.jsx`

A custom, branded loading spinner with:
- Animated circles with brand colors (#6A38C2 and #F83002)
- Gradient text and pulsing dots
- Used during app initialization (PersistGate)
- Smooth animations and modern design

**Features**:
- Multi-layered animation (rotating circles, spinning icon, pulsing dots)
- Gradient color scheme matching brand identity
- Responsive design
- Informative loading text

**Usage**:
```jsx
<PersistGate loading={<LoadingSpinner />} persistor={persistor}>
  <App />
</PersistGate>
```

### 2. ErrorBoundary Component
**Location**: `frontend/src/components/ErrorBoundary.jsx`

React class component for catching JavaScript errors:
- Catches errors anywhere in component tree
- Displays fallback UI with reload option
- Logs errors to console for debugging
- Prevents entire app crash

**Features**:
- Graceful error handling
- User-friendly error message
- Quick recovery with page reload
- Error logging for debugging

**Usage**:
```jsx
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

**Error Display**:
- Clean, centered layout
- Clear error message
- Reload button for recovery
- Prevents blank screen errors

### 3. SocketContext Provider
**Location**: `frontend/src/contexts/SocketContext.jsx`

Centralized WebSocket management using React Context:

**Features**:
- Global Socket.IO connection
- Connection state management
- Room join/leave utilities
- Automatic reconnection
- Error handling

**Exported Functions**:
```javascript
- useSocket() // Access socket instance and connection state
- joinChat(applicationId) // Join specific chat room
- leaveChat(applicationId) // Leave chat room
- sendMessage(data) // Send chat message
```

**Connection Handling**:
- Auto-connects on mount
- Logs connection status
- Handles disconnections
- Supports both WebSocket and polling

**Usage**:
```jsx
const { socket, isConnected, joinChat, sendMessage } = useSocket();

useEffect(() => {
  if (isConnected) {
    joinChat(applicationId);
  }
}, [isConnected, applicationId]);
```

---

## �📡 API Endpoints Documentation

### Base URL
- **Development**: `http://localhost:8000/api/v1`
- **Production**: `https://your-domain.com/api/v1`

### User Endpoints

#### 1. Register User
```
POST /user/register
Content-Type: multipart/form-data

Body:
{
  fullname: String,
  email: String,
  phoneNumber: String,
  password: String,
  role: String (student|recruiter),
  file: File (optional - profile picture)
}

Response (201):
{
  message: "User registered successfully",
  success: true
}
```

#### 2. Login User
```
POST /user/login
Content-Type: application/json

Body:
{
  email: String,
  password: String,
  role: String
}

Response (200):
{
  message: "Login successful [username]",
  success: true,
  user: {
    _id, fullname, email, phoneNumber, role, profile
  }
}
```

#### 3. Google OAuth Login (NEW)
```
POST /user/google
Content-Type: application/json

Body:
{
  idToken: String (from Google),
  role: String (student|recruiter)
}

Response (200):
{
  message: "Welcome [username]",
  success: true,
  user: {
    _id, fullname, email, phoneNumber, role, profile
  }
}

Notes:
- Creates new user if email doesn't exist
- Sets profile picture from Google account
- No password required for Google users
- phoneNumber is optional
```

#### 4. Logout User
```
GET /user/logout

Response (200):
{
  message: "Logout successful",
  success: true
}
```

#### 5. Update Profile
```
POST /user/profile/update
Authorization: Required
Content-Type: multipart/form-data

Body:
{
  fullname: String,
  email: String,
  phoneNumber: String,
  bio: String,
  skills: String (comma-separated),
  file: File (optional - resume PDF)
}

Response (200):
{
  message: "Profile updated successfully",
  success: true,
  user: { /* user object */ }
}
```

### Company Endpoints

#### 1. Register Company
```
POST /company/register
Authorization: Required (Recruiter)

Body:
{
  companyName: String,
  description: String (optional),
  website: String (optional),
  location: String (optional)
}

Response (201):
{
  message: "Company registered successfully",
  success: true,
  company: { /* company object */ }
}
```

#### 2. Get User's Companies
```
GET /company/get
Authorization: Required (Recruiter)

Response (200):
{
  message: "Companies retrieved successfully",
  success: true,
  companies: [ /* array of companies */ ]
}
```

#### 3. Get Company by ID
```
GET /company/get/:id
Authorization: Required

Response (200):
{
  message: "Company retrieved successfully",
  success: true,
  company: { /* company object */ }
}
```

#### 4. Update Company
```
PUT /company/update/:id
Authorization: Required (Recruiter)
Content-Type: multipart/form-data

Body:
{
  name: String,
  description: String,
  website: String,
  location: String,
  file: File (optional - logo)
}

Response (200):
{
  message: "Company updated successfully",
  success: true,
  company: { /* updated company */ }
}
```

### Job Endpoints

#### 1. Post Job
```
POST /job/post
Authorization: Required (Recruiter)

Body:
{
  title: String,
  description: String,
  requirements: String (comma-separated),
  salary: Number,
  location: String,
  jobType: String,
  experience: Number,
  position: String,
  companyId: String
}

Response (201):
{
  message: "Job posted successfully",
  success: true,
  job: { /* job object */ }
}
```

#### 2. Get Jobs (with search)
```
GET /job/get?keywords=developer

Response (200):
{
  message: "Jobs retrieved successfully",
  success: true,
  jobs: [ /* array of jobs with company info */ ]
}
```

#### 3. Get Job by ID
```
GET /job/get/:id

Response (200):
{
  message: "Job retrieved successfully",
  success: true,
  job: { /* job with applications and company */ }
}
```

#### 4. Get Admin Jobs
```
GET /job/getadminjobs
Authorization: Required (Recruiter)

Response (200):
{
  message: "Jobs retrieved successfully",
  success: true,
  jobs: [ /* jobs created by recruiter */ ]
}
```

### Application Endpoints

#### 1. Apply for Job
```
POST /application/apply/:id
Authorization: Required (Student)

Response (201):
{
  message: "Job application submitted successfully",
  success: true,
  application: { /* application object */ }
}
```

#### 2. Get Applied Jobs
```
GET /application/get
Authorization: Required (Student)

Response (200):
{
  message: "Applications retrieved successfully",
  success: true,
  application: [ /* array with job & company info */ ]
}
```

#### 3. Get Applicants for Job
```
GET /application/:id/applicants
Authorization: Required (Recruiter)

Response (200):
{
  message: "Applicants retrieved successfully",
  success: true,
  applicants: [ /* applications with user profiles */ ]
}
```

#### 4. Update Application Status
```
POST /application/status/:id/update
Authorization: Required (Recruiter)

Body:
{
  status: String (applied|interviewed|offered|rejected)
}

Response (200):
{
  message: "Application status updated successfully",
  success: true,
  application: { /* updated application */ }
}
```

### Chat Endpoints

#### 1. Get User's Chats
```
GET /chat/chats
Authorization: Required

Response (200):
{
  success: true,
  chats: [ /* chats with user & job info */ ]
}
```

#### 2. Get Chat by Application
```
GET /chat/application/:applicationId
Authorization: Required

Response (200):
{
  success: true,
  chat: { /* chat with all messages */ }
}
```

#### 3. Create Chat
```
POST /chat/create
Authorization: Required

Body:
{
  applicationId: String
}

Response (201):
{
  success: true,
  chat: { /* new chat object */ }
}
```

#### 4. Send Message
```
POST /chat/send
Authorization: Required

Body:
{
  chatId: String,
  content: String
}

Response (200):
{
  success: true,
  message: { /* new message object */ }
}
```

#### 5. Mark Messages as Read
```
POST /chat/read
Authorization: Required

Body:
{
  chatId: String
}

Response (200):
{
  success: true,
  chat: { /* updated chat */ }
}
```

### Job Hunt (External Search) Endpoints

#### 1. Search External Jobs
```
POST /job-hunt/search
Authorization: Required (Student)

Body:
{
  city: String,
  country: String,
  field: String (optional),
  page: Number (default: 1),
  numPages: Number (default: 3)
}

Response (200):
{
  message: "Jobs searched successfully",
  success: true,
  data: {
    jobs: [ /* external jobs */ ],
    totalResults: Number,
    searchQuery: Object,
    searchId: String,
    pagination: Object
  }
}
```

#### 2. Get Search History
```
GET /job-hunt/history
Authorization: Required

Response (200):
{
  message: "Job history retrieved successfully",
  success: true,
  data: [ /* last 10 searches */ ]
}
```

#### 3. Get Search by ID
```
GET /job-hunt/search/:searchId
Authorization: Required

Response (200):
{
  message: "Job search retrieved successfully",
  success: true,
  data: { /* search results */ }
}
```

#### 4. Delete Search
```
DELETE /job-hunt/search/:searchId
Authorization: Required

Response (200):
{
  message: "Job search deleted successfully",
  success: true
}
```

---

## ⚡ Features & Functionality

### 1. User Authentication & Authorization
- **Registration**: Email-based with role selection (Student/Recruiter)
- **Login**: JWT-based authentication with httpOnly cookies
- **Google OAuth**: Sign in with Google (NEW)
  - Automatic account creation
  - Profile picture sync
  - No password required
  - Role selection before sign-in
- **Password Security**: bcrypt hashing (salt rounds: 10)
- **Token Expiry**: 7 days
- **Profile Pictures**: Cloudinary integration during signup
- **Protected Routes**: Middleware verification for secure endpoints
- **Session Persistence**: Redux Persist for maintaining user sessions

### 2. Job Management
- **Job Posting** (Recruiter):
  - Create jobs linked to companies
  - Specify requirements, salary, location, type
  - Set experience level and positions
- **Job Browsing** (Student):
  - Search by keywords (title/description)
  - View detailed job information
  - See company details and logo
- **Application Tracking**:
  - Students can apply for jobs
  - Prevents duplicate applications
  - Track application status

### 3. Company Management
- **Company Creation** (Recruiter):
  - Register multiple companies
  - Add description, website, location
  - Upload company logo
- **Company Profiles**:
  - Update company information
  - Associate jobs with companies
  - View all company jobs

### 4. Application Workflow
- **Student Side**:
  - View all applied jobs
  - See application status
  - Access job and company details
- **Recruiter Side**:
  - View all applicants for each job
  - See applicant profiles and resumes
  - Update application status (interviewed, offered, rejected)

### 5. Real-time Chat System
- **Chat Creation**:
  - Automatically created when student applies
  - Links student, recruiter, and application
- **Messaging**:
  - Real-time bidirectional communication
  - Socket.IO powered
  - Message persistence in MongoDB
- **Unread Tracking**:
  - Separate counts for student and recruiter
  - Reset when messages are read
- **Chat Features**:
  - Timestamp on every message
  - Sender identification
  - Active/inactive status

### 6. External Job Search (RapidAPI Integration)
- **Search Functionality**:
  - Search by city, country, and field
  - Pagination support
  - Filters for job type and posting date
- **Search History**:
  - Save search results to database
  - View past searches
  - Delete old searches
- **Job Details**:
  - External job title, company, location
  - Direct application links
  - Salary and employment type

### 7. Profile Management
- **Student Profiles**:
  - Bio and skills (comma-separated)
  - Resume upload (PDF to Cloudinary)
  - View applied jobs
  - Profile picture
- **Recruiter Profiles**:
  - Company association
  - View posted jobs
  - Manage applicants

### 8. File Upload System
- **Cloudinary Integration**:
  - Profile pictures (images)
  - Company logos (images)
  - Resumes (PDFs, resource_type: "raw")
- **Multer Configuration**:
  - Memory storage for temporary handling
  - Single file upload support
  - DataURI conversion for Cloudinary

---

## 🔐 Authentication Flow

### Registration Flow
```
1. User submits registration form
   ↓
2. Frontend sends POST to /user/register
   ↓
3. Backend validates required fields
   ↓
4. If profile picture provided:
   - Convert to DataURI
   - Upload to Cloudinary
   - Get secure_url
   ↓
5. Hash password with bcrypt (10 rounds)
   ↓
6. Create user in MongoDB
   ↓
7. Return success response
```

### Login Flow
```
1. User submits email, password, role
   ↓
2. Frontend sends POST to /user/login
   ↓
3. Backend finds user by email
   ↓
4. Compare password with bcrypt
   ↓
5. Verify role matches
   ↓
6. Generate JWT token (7-day expiry)
   ↓
7. Set httpOnly cookie
   ↓
8. Return user data (excluding password)
   ↓
9. Frontend stores user in Redux + localStorage (persist)
```

### Protected Route Access
```
1. Request to protected endpoint
   ↓
2. isAuthenticated middleware extracts cookie
   ↓
3. Verify JWT token
   ↓
4. Decode to get user ID
   ↓
5. Attach user ID to req.id
   ↓
6. Allow request to proceed
   OR
   Return 401 Unauthorized
```

### Logout Flow
```
1. User clicks logout
   ↓
2. Frontend sends GET to /user/logout
   ↓
3. Backend clears token cookie (maxAge: 0)
   ↓
4. Frontend dispatches Redux logout action
   ↓
5. Clear persisted state
   ↓
6. Redirect to login page
```

---

## 💬 Real-time Chat Implementation

### Socket.IO Server Setup (Backend)
```javascript
// In index.js
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  // Join chat room
  socket.on('join-chat', (applicationId) => {
    socket.join(`chat-${applicationId}`);
  });
  
  // Handle messages
  socket.on('send-message', (data) => {
    io.to(`chat-${data.applicationId}`).emit('new-message', {
      ...data,
      timestamp: new Date()
    });
  });
  
  socket.on('disconnect', () => {
    // Handle cleanup
  });
});
```

### Socket.IO Client Setup (Frontend)
```javascript
// SocketContext.jsx
const socket = io('http://localhost:8000', {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

// Join chat room
socket.emit('join-chat', applicationId);

// Send message
socket.emit('send-message', {
  chatId,
  senderId,
  content,
  applicationId
});

// Listen for new messages
socket.on('new-message', (message) => {
  // Update UI
});
```

### Chat Workflow
```
1. Student applies for job
   ↓
2. Application created in database
   ↓
3. Chat automatically created (or reused)
   - Links: student, recruiter, job, application
   ↓
4. User opens chat interface
   ↓
5. Socket.IO connection established
   ↓
6. Client emits 'join-chat' with applicationId
   ↓
7. Server adds socket to room `chat-${applicationId}`
   ↓
8. User sends message
   ↓
9. Message saved to MongoDB (chat.messages array)
   ↓
10. Server emits 'new-message' to room
   ↓
11. All clients in room receive message
   ↓
12. UI updates in real-time
```

### Unread Count Management
```
- When message sent:
  - Increment unread count for recipient
  - Update lastMessage timestamp
  
- When chat opened:
  - Call markAsRead API
  - Reset unread count for current user
  - Update read status of messages
```

---

## 🔍 External Job Search Integration

### RapidAPI Configuration
```javascript
const options = {
  method: 'GET',
  url: 'https://jsearch.p.rapidapi.com/search',
  params: {
    query: `${field} internship jobs in ${city}`,
    page: '1',
    num_pages: '3',
    country: country.toLowerCase(),
    date_posted: 'all'
  },
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'jsearch.p.rapidapi.com'
  }
};
```

### Search Flow
```
1. Student navigates to Job Hunt page
   ↓
2. Enters city, country, field (optional)
   ↓
3. Frontend sends POST to /job-hunt/search
   ↓
4. Backend makes request to RapidAPI
   ↓
5. Parse response jobs array
   ↓
6. Save search to JobHunt collection
   - User ID
   - Search params
   - Results array
   - Timestamp
   ↓
7. Return jobs to frontend
   ↓
8. Display jobs with external apply links
```

### Search History
- Stores last 10 searches per user
- Includes full job details for offline viewing
- Deletable by user
- Sorted by most recent

---

## 🧪 Testing Guide

### Backend API Testing

#### Prerequisites
```bash
# Install dependencies
npm install

# Set up .env file
MONG_URI=your_mongodb_connection_string
PORT=8000
SECRET_KEY=your_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

#### Testing User Endpoints

**1. Register User**
```bash
# Using curl
curl -X POST http://localhost:8000/api/v1/user/register \
  -F "fullname=John Doe" \
  -F "email=john@example.com" \
  -F "phoneNumber=1234567890" \
  -F "password=password123" \
  -F "role=student"

# Expected: 201 Created
```

**2. Login User**
```bash
curl -X POST http://localhost:8000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }' \
  -c cookies.txt

# Expected: 200 OK with user object and cookie
```

**3. Update Profile (Authenticated)**
```bash
curl -X POST http://localhost:8000/api/v1/user/profile/update \
  -b cookies.txt \
  -F "fullname=John Updated" \
  -F "email=john@example.com" \
  -F "phoneNumber=1234567890" \
  -F "bio=Software Engineer" \
  -F "skills=JavaScript,React,Node.js"

# Expected: 200 OK with updated user
```

#### Testing Job Endpoints

**1. Post Job (Recruiter)**
```bash
# First login as recruiter, then:
curl -X POST http://localhost:8000/api/v1/job/post \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Frontend Developer",
    "description": "Looking for React developer",
    "requirements": "React,TypeScript,3 years exp",
    "salary": "50000",
    "location": "New York",
    "jobType": "Full-time",
    "experience": 3,
    "position": "Senior Developer",
    "companyId": "your_company_id"
  }'

# Expected: 201 Created
```

**2. Search Jobs**
```bash
curl "http://localhost:8000/api/v1/job/get?keywords=developer"

# Expected: 200 OK with jobs array
```

**3. Apply for Job (Student)**
```bash
curl -X POST http://localhost:8000/api/v1/application/apply/JOB_ID \
  -b cookies.txt

# Expected: 201 Created
```

#### Testing Chat Endpoints

**1. Create Chat**
```bash
curl -X POST http://localhost:8000/api/v1/chat/create \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"applicationId": "APPLICATION_ID"}'

# Expected: 201 Created
```

**2. Send Message**
```bash
curl -X POST http://localhost:8000/api/v1/chat/send \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "CHAT_ID",
    "content": "Hello, I have a question about the position"
  }'

# Expected: 200 OK
```

### Frontend Testing

#### Manual Testing Checklist

**Authentication**
- [ ] Register as student with profile picture
- [ ] Register as recruiter
- [ ] Login with correct credentials
- [ ] Login fails with wrong credentials
- [ ] Logout clears session
- [ ] Protected routes redirect to login

**Student Workflow**
- [ ] Browse available jobs
- [ ] Search jobs by keyword
- [ ] View job details
- [ ] Apply for job
- [ ] View applied jobs with status
- [ ] Update profile with resume
- [ ] Access external job search
- [ ] View search history
- [ ] Open chat with recruiter

**Recruiter Workflow**
- [ ] Create company
- [ ] Update company with logo
- [ ] Post new job
- [ ] View all posted jobs
- [ ] View applicants for each job
- [ ] Update application status
- [ ] Respond in chat to students

**Real-time Features**
- [ ] Messages appear instantly
- [ ] Unread count updates
- [ ] Socket reconnects after disconnect
- [ ] Multiple tabs work correctly

#### Socket.IO Testing
```javascript
// Browser console
const socket = io('http://localhost:8000');

socket.on('connect', () => {
  console.log('Connected:', socket.id);
  socket.emit('join-chat', 'test-app-id');
});

socket.on('new-message', (msg) => {
  console.log('New message:', msg);
});
```

---

## 🚀 Deployment Guide

### Local Development Setup

#### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Google OAuth Client ID (for authentication)
- Cloudinary Account
- Minikube (optional - for Kubernetes testing)

#### Environment Configuration

**Backend (.env)**:
```bash
# Database
MONG_URI=mongodb://localhost:27017/jobportal
# OR MongoDB Atlas
MONG_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal

# Server
PORT=8000
SECRET_KEY=your_secret_key

# Cloudinary
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

**Frontend (.env)**:
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
```

#### Installation Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd job-portal

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Start MongoDB (if using local)
mongod

# 5. Start backend server
cd backend
npm run dev
# Server runs on http://localhost:8000

# 6. Start frontend (new terminal)
cd frontend
npm run dev
# App runs on http://localhost:5173
```

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (frontend)
   - `http://localhost:8000` (backend)
6. Add authorized redirect URIs:
   - `http://localhost:5173`
7. Copy Client ID to both `.env` files

---

### Backend Deployment (Render / Railway / Heroku)

#### 1. Prepare Backend
```bash
# Ensure package.json has correct scripts
"scripts": {
  "start": "node backend/index.js",
  "dev": "nodemon backend/index.js"
}
```

#### 2. Environment Variables
Set these on your hosting platform:
```
MONG_URI=mongodb+srv://...
PORT=8000
SECRET_KEY=your_production_secret
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_key
API_SECRET=your_cloudinary_secret
GOOGLE_CLIENT_ID=your_google_client_id
NODE_ENV=production
```

**Important**: Update Google OAuth authorized origins to include production URL

#### 3. Deploy to Render
```bash
# Connect GitHub repo
# Set root directory: ./
# Build command: npm install
# Start command: npm start
# Add environment variables
```

### Frontend Deployment (Vercel / Netlify)

#### 1. Update Environment Variables
Create `frontend/.env.production`:
```
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_SOCKET_URL=https://your-backend.onrender.com
```

#### 2. Build Frontend
```bash
cd frontend
npm run build
# Creates frontend/dist folder
```

#### 3. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend folder
cd frontend

# Deploy
vercel --prod

# Or use Vercel dashboard:
# - Import GitHub repo
# - Set root directory: frontend
# - Framework: Vite
# - Add environment variables
```

#### 4. Update Backend CORS
```javascript
// backend/index.js
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'
  ],
  credentials: true,
};

// Update Socket.IO CORS
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://your-frontend.vercel.app'
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

### Full Stack Deployment (Alternative)

#### Deploy Both on Render
```bash
# 1. Build script in package.json
"scripts": {
  "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend",
  "start": "node backend/index.js"
}

# 2. Backend serves frontend
# Already configured in index.js:
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
});
```

---

## 🐛 Known Issues & Fixes

### Issue 1: MongoDB Connection Error
**Error**: `querySrv ENOTFOUND _mongodb._tcp.cluster0...`

**Causes**:
- MongoDB cluster is paused/deleted
- IP address not whitelisted
- Incorrect connection string

**Fix**:
1. Login to MongoDB Atlas
2. Check cluster is active
3. Network Access → Add current IP or use `0.0.0.0/0`
4. Verify connection string includes database name:
```
mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### Issue 2: CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Fix**: Update backend CORS configuration
```javascript
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
};
app.use(cors(corsOptions));
```

### Issue 3: Socket.IO Connection Failed
**Error**: `WebSocket connection failed`

**Causes**:
- Backend not running
- Incorrect Socket.IO URL
- CORS not configured

**Fix**:
1. Verify backend is running
2. Check Socket URL in `SocketContext.jsx`:
```javascript
const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';
```
3. Update Socket.IO CORS on backend

### Issue 4: File Upload Fails
**Error**: `File upload failed` / `Cloudinary error`

**Causes**:
- Incorrect Cloudinary credentials
- Missing `resource_type` for PDFs
- File size exceeds limit

**Fix**:
1. Verify Cloudinary credentials in `.env`
2. For PDFs, use `resource_type: "raw"`:
```javascript
const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
  resource_type: "raw",
  folder: "resumes"
});
```
3. Check file size limits in Cloudinary dashboard

### Issue 5: JWT Token Expired
**Error**: `Session expired. Please login again.`

**Expected Behavior**: Token expires after 7 days

**Fix**: User needs to login again. No code fix required.

### Issue 6: Duplicate Application
**Error**: `You have already applied for this job`

**Expected Behavior**: Prevents users from applying twice

**If Incorrect**: Check application controller logic:
```javascript
const existingApplication = await Application.findOne({ 
  job: jobId, 
  applicant: userId 
});
```

### Issue 7: Port Already in Use
**Error**: `EADDRINUSE: address already in use :::8000`

**Fix**:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or change port in .env
PORT=8001
```

### Issue 8: Frontend Environment Variables Not Loaded
**Error**: API calls go to wrong URL

**Fix**:
1. Ensure `.env` file is in `frontend/` directory
2. Prefix variables with `VITE_`:
```
VITE_API_BASE_URL=http://localhost:8000
```
3. Restart dev server after changing `.env`

### Issue 9: Redux State Not Persisting
**Issue**: User logged out after page refresh

**Fix**: Already implemented with redux-persist. If still occurring:
1. Clear browser localStorage
2. Check persist configuration in `store.js`
3. Verify `PersistGate` wraps app in `main.jsx`

### Issue 10: Chat Messages Not Appearing
**Debug Steps**:
1. Check Socket.IO connection: Browser console should show "Connected to Socket.IO server"
2. Verify room join: Check backend logs for `join-chat` event
3. Test message emission: Check network tab for socket.io requests
4. Verify MongoDB: Check chat.messages array is updating

### Issue 11: Google OAuth Login Failed (NEW)
**Error**: `Google Login Failed` / `Authentication failed`

**Causes**:
- Invalid Google Client ID
- User didn't select role before sign-in
- CORS issues with Google OAuth
- Network/firewall blocking Google services

**Fix**:
1. Verify `GOOGLE_CLIENT_ID` is correct in both `.env` files
2. Ensure user selects role (Student/Recruiter) before clicking Google sign-in
3. Check browser console for specific error messages
4. Verify authorized origins in Google Cloud Console:
   ```
   http://localhost:5173
   http://localhost:8000
   ```
5. Clear browser cache and cookies
6. Try incognito/private browsing mode

**Backend Debug**:
```javascript
// Check if token verification is working
console.log('ID Token:', idToken);
console.log('Verified payload:', payload);
```

### Issue 12: LoadingSpinner Not Displaying
**Issue**: White screen during app initialization

**Causes**:
- PersistGate not configured correctly
- LoadingSpinner import error

**Fix**:
1. Verify `main.jsx` has correct setup:
```javascript
<PersistGate loading={<LoadingSpinner />} persistor={persistor}>
  <App />
</PersistGate>
```
2. Check LoadingSpinner component exists
3. Verify no import errors in console

### Issue 13: ErrorBoundary Not Catching Errors
**Issue**: App still crashes on errors

**Causes**:
- ErrorBoundary not wrapping components
- Error in ErrorBoundary itself
- Event handler errors (not caught by boundaries)

**Fix**:
1. Wrap app or specific components:
```jsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```
2. For event handlers, use try-catch:
```javascript
const handleClick = async () => {
  try {
    // Your code
  } catch (error) {
    console.error(error);
    toast.error('Something went wrong');
  }
};
```

### Issue 14: Socket Connection State Not Updating
**Error**: `isConnected` always false

**Causes**:
- SocketContext not providing correct state
- Component not using useSocket hook

**Fix**:
1. Ensure component uses the hook:
```javascript
const { socket, isConnected } = useSocket();
```
2. Check SocketContext.jsx connection listeners
3. Verify backend Socket.IO server is running
4. Check CORS configuration for WebSocket

---

## 📊 Performance Optimization

### Backend Optimizations
1. **Database Indexing**: Add indexes on frequently queried fields
```javascript
// In models
userSchema.index({ email: 1 });
jobSchema.index({ title: 'text', description: 'text' });
```

2. **Population Limiting**: Select only required fields
```javascript
.populate('company', 'name logo')
.populate('applicant', 'fullname email profile')
```

3. **Pagination**: Implement for large datasets
```javascript
const page = req.query.page || 1;
const limit = 10;
const skip = (page - 1) * limit;
const jobs = await Job.find().skip(skip).limit(limit);
```

### Frontend Optimizations
1. **Code Splitting**: Already implemented with React.lazy
2. **Image Optimization**: Use Cloudinary transformations
```javascript
// Resize images on delivery
cloudinary.url('image.jpg', { width: 300, height: 300, crop: 'fill' })
```
3. **Debounce Search**: Prevent excessive API calls
```javascript
import { debounce } from 'lodash';
const debouncedSearch = debounce(searchFunction, 500);
```

---

## 🔒 Security Best Practices

### Implemented
✅ Password hashing with bcrypt  
✅ JWT with httpOnly cookies  
✅ CORS configuration  
✅ Input validation on backend  
✅ File type restrictions  
✅ Environment variables for secrets  
✅ Authentication middleware  
✅ Role-based access control  

### Recommended Additions
- Rate limiting (express-rate-limit)
- Input sanitization (express-validator)
- Helmet.js for security headers
- HTTPS in production
- Content Security Policy
- SQL injection prevention (already handled by Mongoose)

---

## 📝 Project Status & Testing Results

### ✅ Completed Features
- User authentication (Student & Recruiter)
- **Google OAuth authentication** (NEW)
- Job posting and management
- Company management
- Application workflow
- Real-time chat system
- External job search (RapidAPI)
- Profile management with file uploads
- Redux state management with persistence
- Socket.IO integration
- Protected routes
- **ErrorBoundary for error handling** (NEW)
- **Custom LoadingSpinner component** (NEW)
- **SocketContext for centralized WebSocket management** (NEW)
- **Enhanced UI/UX with animations** (NEW)

### 🧪 Test Results

#### Backend APIs: ✅ All Working
- User registration: ✅
- User login: ✅
- **Google OAuth login**: ✅ (NEW)
- Profile update: ✅
- Company CRUD: ✅
- Job CRUD: ✅
- Application management: ✅
- Chat functionality: ✅
- External job search: ✅

#### Frontend Components: ✅ All Working
- Authentication flows: ✅
- **Google OAuth integration**: ✅ (NEW)
- Student dashboard: ✅
- Recruiter dashboard: ✅
- Job browsing: ✅
- Application tracking: ✅
- Chat interface: ✅
- Profile management: ✅
- **Error handling (ErrorBoundary)**: ✅ (NEW)
- **Loading states (LoadingSpinner)**: ✅ (NEW)

#### Real-time Features: ✅ Working
- Socket.IO connection: ✅
- **SocketContext management**: ✅ (NEW)
- Message delivery: ✅
- Unread counts: ✅
- Room management: ✅

### 🔧 Fixed Issues
1. ✅ Localhost configuration (was using Railway URL)
2. ✅ MongoDB connection string (added database name)
3. ✅ Socket.IO CORS (updated to localhost)
4. ✅ Axios base URL (removed /api/v1 duplication)
5. ✅ Environment variables (created frontend/.env)
6. ✅ Google OAuth integration (NEW)
7. ✅ Error boundary implementation (NEW)
8. ✅ Loading states and UX improvements (NEW)
9. ✅ Socket connection management with Context (NEW)
10. ✅ React and dependencies updated to latest versions (NEW)

### 📈 Recommendations for Future Enhancements
1. Add email verification
2. Implement password reset
3. Add job categories/filters
4. Implement saved jobs feature
5. Add recruiter analytics dashboard
6. Email notifications for application updates
7. Video interview scheduling
8. Resume parser integration
9. Job recommendations based on skills
10. Multi-language support
11. **Kubernetes deployment** (Minikube configured)
12. **CI/CD pipeline integration**
13. **Docker containerization**
14. **Microservices architecture**
15. **Progressive Web App (PWA) features**

---

## 🎓 Learning Resources

### MERN Stack
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)

### Socket.IO
- [Socket.IO Documentation](https://socket.io/docs/)
- [Real-time Applications Guide](https://socket.io/get-started/)

### Redux
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux Persist](https://github.com/rt2zz/redux-persist)

### Cloudinary
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js Integration](https://cloudinary.com/documentation/node_integration)

---

## 📧 Support & Contact

For issues or questions about this project:
1. Check this documentation first
2. Review the [Known Issues](#known-issues--fixes) section
3. Ensure all environment variables are set correctly
4. Verify MongoDB connection is active
5. Check browser console and backend logs for errors

---

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

---

**Last Updated**: February 2, 2026  
**Version**: 1.1.0  
**Status**: ✅ Production Ready (Localhost)

