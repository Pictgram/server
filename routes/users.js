var express = require('express');
var router = express.Router();
const Controller = require('../controllers/userController')
const { checkUser } = require('../middlewares')
const image = require('../helpers/index')

router.post('/', Controller.create)
router.post('/login', Controller.login)
router.post('/gooSi', Controller.gooSi)

router.get('/', checkUser, Controller.findOne)
router.put('/', checkUser,image.multer.single('image'),image.sendUploadToGCS, Controller.update)

module.exports = router;
