var express = require('express');
var router = express.Router();
const { check } = require("express-validator");
const memberController = require('../controllers/controller-member');
const auth = require('../middleware/auth');

router.post('/',[
    check('group_id').isEmpty(),
    check('name').isEmpty().isAlphanumeric(),
    check('email').isEmpty().isEmail(),
  ],auth,
  memberController.createMember);

router.get('/:id' , memberController.getAllMember);

module.exports = router;