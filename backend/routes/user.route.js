import express from 'express';
import { register, login, updateProfile, logout, googleLogin } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload, multipleUpload } from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(singleUpload,register);
router.route('/login').post(login);
router.route('/google').post(googleLogin);
router.route('/logout').get(logout);

router.route('/profile/update').post(isAuthenticated, multipleUpload, updateProfile);

export default router;