import multer from 'multer';

const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single('file');

// Support multiple file uploads (resume and profile photo)
export const multipleUpload = multer({ storage }).fields([
    { name: 'file', maxCount: 1 },           // Resume PDF
    { name: 'profilePhoto', maxCount: 1 }    // Profile photo image
]);