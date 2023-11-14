const multer = require('multer');


const uploadFileFunction = (req, res, fileAttribute, destination) => {

    console.log("11");
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${destination}`);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '_' + file.originalname);
        }
    });
    console.log("22");
    const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PNG, JPEG, JPG, and WebP images are allowed.'));
        }
    };



    console.log("33");
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
                console.log("44");
                // Resolve the Promise with the uploaded file
                resolve(req.file);
            }
        });
    });
};

module.exports = {
    uploadFileFunction,
};