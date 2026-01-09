const multer = require('multer');

// Configure storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    // Accept standard document formats
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip',
        'image/jpeg',
        'image/png'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOCX, ZIP, JPG, and PNG are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 16 * 1024 * 1024 // 16MB limit (MongoDB document size limit is 16MB)
    },
    fileFilter: fileFilter
});

module.exports = upload;
