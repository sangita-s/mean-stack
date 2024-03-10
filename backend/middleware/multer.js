
const multer = require('multer');

// file extension mime type
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    //executed when multler tries to save a file
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]; //79
        console.log('Mimetype is ' + isValid);
        let error = new Error("Invalid mime type"); //79
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

module.exports = multer({ storage: storage }).single("image");