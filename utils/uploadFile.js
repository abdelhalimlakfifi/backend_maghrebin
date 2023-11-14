const multer = require('multer');


const uploadFileFunction = (req, res, fileAttribute, destination) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${destination}`);
        },
        filename: (req, file, cb) => {
            // Extract the file extension
            const fileExtension = file.originalname.split('.').pop();

            // Replace spaces and symbols with underscores in the file name
            const cleanedFileName = file.originalname.replace(/[\s\W]+/g, '_');

            // Create a file name with the current date and time
            const currentDate = new Date().toISOString().replace(/[-:.]/g, '_');;

            // Combine the date, cleaned file name, and file extension with underscores
            const finalFileName = currentDate + '_' + cleanedFileName + '.' + fileExtension;

            cb(null, finalFileName );
        }
    });
    const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PNG, JPEG, JPG, and WebP images are allowed.'));
        }
    };



    return new Promise((resolve, reject) => {
        // Configure upload
        const upload = multer({
            storage,
            fileFilter,
            limits: {
                fileSize: 2 * 1024 * 1024, // 2MB limit
            },
        }).single(fileAttribute);

        // Perform upload
        upload(req, res, (err) => {
            if (err) {
                // An unknown error occurred when uploading
                reject(err.message);
            } else {

                // Resolve the Promise with the uploaded file
                resolve(req.file);
            }
        });
    });
};

module.exports = {
    uploadFileFunction,
};