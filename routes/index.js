var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  res.send('my name is ' + req.body.name);
});

/* GET home page. */
router.get('/', function(req, res) {
  res.send(req.body.name);
});



module.exports = router;
