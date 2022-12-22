var express = require('express');
var router = express.Router();
const { check} = require("express-validator");

const signupController = require('../controllers/controller-user');


/* GET users listing. */
router.post('/signup',[
    check('username').isEmpty().isAlphanumeric(),
    check('email').isEmpty().isEmail(),
    check('password').isEmpty().isLength({ min: 5, max:8 }).isStrongPassword(),
  ],
  signupController.createUser);

router.post('/signin',[
  check('username').isEmpty(),
  check('email').isEmpty(),
  check('password').isEmpty(),
],signupController.loginUser);

module.exports = router;
