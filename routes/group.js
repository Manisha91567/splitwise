var express = require('express');
var router = express.Router();
const { check} = require("express-validator");
var auth = require('../middleware/auth');


const groupController = require('../controllers/controller-group');


/* GET users listing. */
router.post('/',[
    check('groupName').isEmpty().isAlphanumeric(),
  ],
  auth ,groupController.createGroup);

router.get ('/' , groupController.getGroup);

router.put('/:id' , groupController.update);

router.delete('/:id', groupController.deleteGroup);


module.exports = router;
