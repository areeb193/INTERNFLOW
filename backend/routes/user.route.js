import express from 'express';
import { register, login, updateProfile, logout, googleLogin } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload, multipleUpload } from '../middlewares/multer.js';

const router = express.Router();

// POST routes
router.route('/register').post(singleUpload,register);
router.route('/login').post(login);
router.route('/google').post(googleLogin);
router.route('/logout').get(logout);
router.route('/profile/update').post(isAuthenticated, multipleUpload, updateProfile);

// GET route helpers (for testing/info)
router.get('/register', (req, res) => {
  res.json({ message: 'Use POST method to register', method: 'POST', endpoint: '/api/v1/user/register' });
});

router.get('/login', (req, res) => {
  res.json({ message: 'Use POST method to login', method: 'POST', endpoint: '/api/v1/user/login', requiredFields: ['email', 'password', 'role'] });
});

export default router;