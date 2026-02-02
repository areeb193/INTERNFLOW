import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: Number,
        required: false, // CHANGED: Google users won't have phone initially
    },
    password: {
        type: String,
        required: false, // CHANGED: Google users won't have password
    },
    role:{
        type: String,
        enum: ['student', 'recruiter'],
        required: true,
    },
    profile: {
        bio:{type: String},
        skills: [{ type: String }],
        resume: [{ type: String }],
        resumeOriginalName: [{ type: String }],
        company:{type:mongoose.Schema.Types.ObjectId, ref: 'Company'},
        profilePicture: { type: String,
            default: "",

         },
    }
},{timestamps: true});
export const User = mongoose.model('User', userSchema);
    
