const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// GET /register - Serve a registration page
router.get('/register', (req, res) => {
    res.send('This is the registration page.');
});

// POST /register - Handle form submissions
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('fullname.firstname')
            .isLength({ min: 3 })
            .withMessage('First name should be at least 3 characters long'),
        body('password')
            .isLength({ min: 5 })
            .withMessage('Password should be at least 5 characters long')
    ],
    userController.registerUser
);


router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password')
        .isLength({ min: 5 })
        .withMessage('Password should be at least 5 characters long')
] ,
userController.loginUser);

router.get('/profile', authMiddleware.authUser, userController.getUserProfile)

router.get('/logout', authMiddleware.authUser, userController.logoutUser)

module.exports = router;
