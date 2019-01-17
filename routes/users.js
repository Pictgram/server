var express = require('express');
var router = express.Router();
const Controller = require('../controllers/userController')
const { checkUser } = require('../middlewares')

router.post('/', Controller.create)
router.post('/login', Controller.login)
router.post('/gooSi', Controller.gooSi)

router.get('/', checkUser, Controller.findOne)
router.put('/', checkUser, Controller.update)

module.exports = router;
