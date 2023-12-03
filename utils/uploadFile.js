const multer = require('multer');

const uploadFileFunction = (req, res, fileAttribute, destination) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${destination}`);
        },
        filename: (req, file, cb) => {
            const fileExtension = file.originalname.split('.').pop();
            const cleanedFileName = file.originalname.replace(/[\s\W]+/g, '_');
            const currentDate = new Date().toISOString().replace(/[-:.]/g, '_');
            const finalFileName = currentDate + '_' + cleanedFileName + '.' + fileExtension;
            cb(null, finalFileName);
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

        
        const upload = multer({
            storage,
            fileFilter,
            limits: {
                fileSize: 2 * 1024 * 1024, // 2MB limit for each file
            },
        }).single(fileAttribute);

        upload(req, res, (err) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(req.file); // Use req.files to get an array of uploaded files
            }
        });
    });
};



const uploadFileFunctionMultiple = (req, res, fileAttribute, destination) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${destination}`);
        },
        filename: (req, file, cb) => {
            const fileExtension = file.originalname.split('.').pop();
            const cleanedFileName = file.originalname.replace(/[\s\W]+/g, '_');
            const currentDate = new Date().toISOString().replace(/[-:.]/g, '_');
            const finalFileName = currentDate + '_' + cleanedFileName + '.' + fileExtension;
            cb(null, finalFileName);
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
        const upload = multer({
            storage,
            fileFilter,
            limits: {
                fileSize: 2 * 1024 * 1024, // 2MB limit for each file
            },
        }).array(fileAttribute, 5); // '5' is the maximum number of files allowed in this example

        upload(req, res, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(req.files); // Use req.files to get an array of uploaded files
            }
        });
    });
};

module.exports = {
    uploadFileFunction,
    uploadFileFunctionMultiple
};