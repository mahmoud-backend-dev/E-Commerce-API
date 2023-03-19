const multer = require('multer');
const { BadRequest } = require('../errors');

const multerOptions = () => {
    // 1) DisStorage engine
    // const multerStorage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, 'uploads/categories')
    //     },
    //     filename: function (req, file, cb) {
    //         // category-{id}-Date.now().jpeg
    //         const ext = file.mimetype.split('/')[1];
    //         const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    //         cb(null, filename);
    //     }
    // });
    const memoryStorage = multer.memoryStorage();
    const fileFilter = async (req, file, cb) => {
        if (file.mimetype.startsWith("image"))
            cb(null, true)
        else
            cb(new BadRequest("Only Images allowed"), false);
    };
    const upload = multer({ storage: memoryStorage, fileFilter });
    return upload;
}


exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);


exports.uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields); 