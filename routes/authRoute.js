const express = require('express');
const {
    signup,
    login,
    forgotPassword,
    verifyResetCode,
    resetPassword,
} = require('../controller/authController');
const router = express.Router();
const {
    signupValidator,
    loginValidator,
} = require('../utils/validators/authValidator');



router.post('/signup',
    signupValidator,
    signup,
);

router.post('/login',
    loginValidator,
    login,
);

router.post('/forgotPassword',
    forgotPassword,
);

router.post('/verifyResetCode',
    verifyResetCode,
);

router.put('/resetPassword',
    resetPassword,
);


module.exports = router