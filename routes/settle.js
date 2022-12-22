var express = require('express');
var router = express.Router();
const controllerSettle = require('../controllers/controller-settle');
const auth = require('../middleware/auth');

router.post('/',auth, controllerSettle.createSettleAmount);

module.exports = router;