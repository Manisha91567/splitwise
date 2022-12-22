var express = require('express');
var router = express.Router();
const controllerImage = require('../controllers/controller-image');

router.post('/upload', controllerImage.uploadImage);
router.get('/files' , controllerImage.getListImage);
router.get('/files/:id',controllerImage.download);

module.exports = router;    