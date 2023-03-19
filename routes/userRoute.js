const express = require('express');
const {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeImage,
    changeUserPassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserData,
} = require('../controller/userController');
const router = express.Router();
const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    updateLoggedUserValidator,
} = require('../utils/validators/userValidator');

const {
    protect,
    allowedTo,
} = require('../controller/authController')

// Logged User
router.get(
    '/getMe',
    protect,
    getLoggedUserData,
    getUser);

router.put(
    '/changeMyPassword',
    protect,
    updateLoggedUserPassword,
);
        
router.put(
    '/updateMe',
    protect,
    updateLoggedUserValidator,
    updateLoggedUserData,
);


router.delete(
    '/deleteMe',
    protect,
    deleteLoggedUserData,
    );


// Admin
router.put('/changePassword/:id',
    changeUserPasswordValidator,
    changeUserPassword);

router.route('/')
    .get(
        protect,
        allowedTo("manager","admin"),
        getAllUsers)
    .post(
        protect,
        allowedTo("admin"),
        uploadUserImage,
        resizeImage,
        createUserValidator,
        createUser);
router.route('/:id')
    .get(
        protect,
        allowedTo("admin"),
        getUserValidator,
        getUser)
    .put(
        protect,
        allowedTo("admin"),
        uploadUserImage,
        resizeImage,
        updateUserValidator,
        updateUser)
    .delete(
        protect,
        allowedTo("admin"),
        deleteUserValidator,
        deleteUser);

module.exports = router