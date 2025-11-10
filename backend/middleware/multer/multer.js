// import multer from "multer";

// const storage = multer.memoryStorage();
// const upload = multer({ 
//     storage,
//     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
//         if (allowedTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid file type. Only PDF and images allowed.'));
//         }
//     }
// });

// export default upload
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
