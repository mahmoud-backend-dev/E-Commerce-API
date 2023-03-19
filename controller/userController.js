const User = require('../models/User');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleWare');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');

const {
    createOne,
    getOne,
    getAll,
    deleteOne,
}=require('./handlerFactory');
const createToken = require('../utils/createToken');



// Upload Single Image
exports.uploadUserImage = uploadSingleImage("profileImg");

//  Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 97 })
        .toFile(`uploads/users/${filename}`);
    //  set image to body
        req.body.profileImg = filename;
    }
    next();
})

// @desc Create User
// @route POST  /api/v1/users
// @access private
exports.createUser = createOne(User);

// @desc Get List Of User
// @route GET   /api/v1/users
// @access private 
exports.getAllUsers = getAll(User);

// @desc  Get Specific User by id
// @route GET   /api/v1/usres/:id
// @access private
exports.getUser = getOne(User);

exports.changeUserPassword = asyncHandler(async (req, res) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangeAt: Date.now(),
        },
        { new: true, runValidators: true });
    if (!document)
        throw new NotFoundError(`Not have brand for this id: ${id}`)
    res.status(StatusCodes.OK).json({ data: document });
});

// @desc  Get Specific User by id
// @route GET   /api/v1/users/:id
// @access private
exports.updateUser =  asyncHandler(async (req, res) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true });
    if (!document)
        throw new NotFoundError(`Not have brand for this id: ${id}`)
    res.status(StatusCodes.OK).json({ data: document });
});

// @desc  Delete Specific user by id
// @route DELETE   /api/v1/users/:id
// @access private
exports.deleteUser = deleteOne(User);

// @desc  Get Logged User Data
// @route GET   /api/v1/users/getMe
// @access private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
})

// @desc  Update Logged User Password
// @route PUT   /api/v1/users/changeMyPassword
// @access private/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // 1) Update user password based user payload (req.user._id)
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangeAt: Date.now()
        },
        {
            new: true,
            runValidators: true
        }
    );

    // 2) generat token 
    const token = createToken(user._id);
    res.status(StatusCodes.OK).json({ data: user, token });
})

// @desc  Update Logged User Data (without password, role)
// @route PUT   /api/v1/users/updateMe
// @access private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const userUpdate = await User.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            slug:req.body.slug,
        },
        {
            new: true,
        }
    );

    res.status(StatusCodes.OK).json({ data: userUpdate });
})

// @desc  Deactivate Logged User
// @route DELET   /api/v1/users/deleteMe
// @access private/protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(StatusCodes.NO_CONTENT).json({ status: "Success" });
})



