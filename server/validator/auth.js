const { check } = require('express-validator')

exports.userSignUpValidator = [
    check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
    
    check('email')
    .isEmail()
    .withMessage('Email is valid'),

    check('password')
    .isLength({min : 6})
    .withMessage('Password shlud be 6 Char'),
]

exports.userSignInValidator = [

    check('email')
    .isEmail()
    .withMessage('Email is valid'),

    check('password')
    .isLength({min : 6})
    .withMessage('Password shlud be 6 Char'),
]