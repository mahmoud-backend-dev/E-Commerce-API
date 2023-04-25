const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require("bcryptjs");
const { BadRequest, UnauthenticatedError, NotFoundError, CustomErrorAPI } = require('../errors');
const sendEmail = require('../utils/sendEmail'); 
const createToken = require('../utils/createToken');
const jwt = require('jsonwebtoken');
const { sanitizeUser } = require('../utils/sanitizeData');

const hashedResetCodeByCrypto = (resetCode) =>     crypto
.createHash('sha256')
.update(resetCode)
.digest('hex');



// @desc Signup 
// @route POST  /api/v1/auth/signup
// @access public
exports.signup = asyncHandler(async (req, res, next) => {
    // 1) Create User 
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    // 2) Generate token 
    const token = createToken(user._id);

    res.status(StatusCodes.CREATED).json({ data: sanitizeUser(user), token, });
}) 


// @desc Login 
// @route POST  /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
    // 1) check  password is correct or not
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password)))
        throw new BadRequest('Password or E-mail incorrect');
    // 2) Generate token 
    const token = createToken(user._id);

    res.status(StatusCodes.OK).json({ data: sanitizeUser(user), token, });
});

// @desc make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
    // 1) Check if token exist, if hold his
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token)
        throw new UnauthenticatedError('You are not login, please login to get access this route')
    
    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.jwt_secert_key);    

    // 3) Check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser)
        throw new UnauthenticatedError('The user that belong to this token does no longer exist');
    
    // 4) Check if user change his password after token created
    if (currentUser.passwordChangeAt) {
        const passwordChangedTimeStamp = parseInt((
            currentUser.passwordChangeAt.getTime() / 1000
        ), 10);
        // if password changed after token created (Error)
        if (passwordChangedTimeStamp > decoded.iat)
            throw new BadRequest('User recently changed his password, please login again...');   
    }
    req.user = currentUser;
    next()
})

//  allwoed to (user permission)
exports.allowedTo = (...roles) => asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user)
    if (!roles.includes(req.user.role)) {
        throw new UnauthenticatedError("You are not allowed to access this route")
    };
    next();
})


// @desc Forgot Password 
// @route POST  /api/v1/auth/forgotPassword
// @access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // 1) Get user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        throw new NotFoundError(`There is no user with that email ${req.body.email}`)
    // 2) If user exist, Generate reset random 6 digits and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = hashedResetCodeByCrypto(resetCode);
    // Save hashed password reset code into db
    user.passwordResetCode = hashedResetCode;
    // Add expiration time for password reset code (10 min)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();
    // 3) Send the reset code via email
    const message = `Hi ${user.name},
    We received a request to reset the password on your E-shop Account.
    ${resetCode} 
    Enter this code to complete the reset.
    Thanks for helping us keep your account secure.
    The E-shop Team`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code (valid for 10 min) ',
            message,
        });
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        throw new CustomErrorAPI('There is an error in sending email', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).json({ status: 'Success', message: 'Reset code sent to email' });
})


// @desc Verify Reset Code 
// @route POST  /api/v1/auth/verifyResetCode
// @access public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
    // 1) Get user based on reset code
    const hashedResetCode = hashedResetCodeByCrypto(req.body.resetCode);
    const user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user)
        throw new BadRequest('Reset code invalid or expired')
    
    // 2) Reset code valid
    user.passwordResetVerified = true;
    await user.save();
    res.status(StatusCodes.OK).json({ status: 'Success' });
})


// @desc  Reset Password
// @route PUT  /api/v1/auth/resetPassword
// @access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // 1) Get user based on email
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        throw new NotFoundError(`There is no user with that email ${req.body.email}`)
    // 2) Check if reset code verified
    if (!user.passwordResetVerified)
        throw new BadRequest('Reset code not verified');
    
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    // 3) if everything is ok, generate token
    const token = createToken(user._id);
    res.status(StatusCodes.OK).json({ token });
})