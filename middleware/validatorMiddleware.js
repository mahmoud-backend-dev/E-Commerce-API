const fs = require('fs');
const { validationResult } = require('express-validator');

// Finds the validation errors in this request and wraps them in an object with handy functions
const validatorMiddleWare = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        };
        if (req.files) {
            if (req.files.imageCover) {
                fs.unlinkSync(req.files.imageCover[0].path);
            }
            if (req.files.images) {
                req.files.images.forEach((img) => {
                    fs.unlinkSync(img.path);
                })
            }
        }
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = validatorMiddleWare;