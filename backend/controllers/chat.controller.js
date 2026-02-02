import { Chat } from '../models/chat.model.js';
import { Application } from '../models/application.model.js';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';

// Get all chats for a user
export const getChats = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    const userRole = user.role;
    
    let chats;
    if (userRole === 'student') {
      chats = await Chat.find({ student: userId, isActive: true })
        .populate('recruiter', 'fullname profile.profilePicture')
        .populate('job', 'title company')
        .populate('application', 'status')
        .sort({ lastMessage: -1 });
    } else {
      chats = await Chat.find({ recruiter: userId, isActive: true })
        .populate('student', 'fullname profile.profilePicture')
        .populate('job', 'title company')
        .populate('application', 'status')
        .sort({ lastMessage: -1 });
    }
    
    res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get specific chat by application ID
export const getChatByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.id;
    
    const chat = await Chat.findOne({ application: applicationId })
      .populate('student', 'fullname profile.profilePicture')
      .populate('recruiter', 'fullname profile.profilePicture')
      .populate('job', 'title company')
      .populate('application', 'status');
    
    if (!chat) {
      // Return success with null chat instead of 404
      return res.status(200).json({ success: true, chat: null, message: 'No chat found for this application' });
    }
    
    // Check if user is part of this chat
    const isStudent = chat.student._id.toString() === userId.toString();
    const isRecruiter = chat.recruiter._id.toString() === userId.toString();
    
    if (!isStudent && !isRecruiter) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error('Error getting chat:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new chat
export const createChat = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const userId = req.id;
    
    // Check if chat already exists
    const existingChat = await Chat.findOne({ application: applicationId });
    if (existingChat) {
      // Get current user to check their role
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      // If current user is a recruiter and they're not the assigned recruiter, update the chat
      if (currentUser.role === 'recruiter' && existingChat.recruiter.toString() !== currentUser._id.toString()) {
        existingChat.recruiter = currentUser._id;
        await existingChat.save();
        
        const updatedChat = await Chat.findById(existingChat._id)
          .populate('student', 'fullname profile.profilePicture')
          .populate('recruiter', 'fullname profile.profilePicture')
          .populate('job', 'title company')
          .populate('application', 'status');
        
        return res.status(200).json({ success: true, chat: updatedChat });
      }
      
      return res.status(200).json({ success: true, chat: existingChat });
    }
    
    // Get current user to check their role
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get application details
    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('applicant');
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    let recruiterId;
    
    // If current user is a recruiter, use them as the recruiter
    if (currentUser.role === 'recruiter') {
      recruiterId = currentUser._id;
    } else {
      // If current user is a student, find a recruiter for the job's company
      const recruiter = await User.findOne({
        'profile.company': application.job.company,
        role: 'recruiter'
      });
      
      if (!recruiter) {
        // Try to find any recruiter if specific one not found
        const anyRecruiter = await User.findOne({ role: 'recruiter' });
        if (!anyRecruiter) {
          return res.status(404).json({ success: false, message: 'No recruiter available' });
        }
        recruiterId = anyRecruiter._id;
      } else {
        recruiterId = recruiter._id;
      }
    }
    
    const chat = await Chat.create({
      application: applicationId,
      student: application.applicant._id,
      recruiter: recruiterId,
      job: application.job._id
    });
    
    const populatedChat = await Chat.findById(chat._id)
      .populate('student', 'fullname profile.profilePicture')
      .populate('recruiter', 'fullname profile.profilePicture')
      .populate('job', 'title company')
      .populate('application', 'status');
    
    res.status(201).json({ success: true, chat: populatedChat });
  } catch (error) {
    console.error('❌ Error creating chat:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.id;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    
    // Check if user is part of this chat
    const isStudent = chat.student.toString() === senderId.toString();
    const isRecruiter = chat.recruiter.toString() === senderId.toString();
    
    if (!isStudent && !isRecruiter) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Add message to chat
    const message = {
      sender: senderId,
      content,
      timestamp: new Date()
    };
    
    chat.messages.push(message);
    chat.lastMessage = new Date();
    
    // Update unread count for the other user
    if (isStudent) {
      chat.unreadCount.recruiter += 1;
    } else {
      chat.unreadCount.student += 1;
    }
    
    await chat.save();
    
    const populatedChat = await Chat.findById(chatId)
      .populate('student', 'fullname profile.profilePicture')
      .populate('recruiter', 'fullname profile.profilePicture')
      .populate('messages.sender', 'fullname profile.profilePicture');
    
    const newMessage = populatedChat.messages[populatedChat.messages.length - 1];
    
    res.status(200).json({ 
      success: true, 
      message: newMessage,
      chat: populatedChat
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.id;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    
    // Mark messages as read for the current user
    if (userId.toString() === chat.student.toString()) {
      chat.unreadCount.student = 0;
    } else if (userId.toString() === chat.recruiter.toString()) {
      chat.unreadCount.recruiter = 0;
    }
    
    await chat.save();
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
