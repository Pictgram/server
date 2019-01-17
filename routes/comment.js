var express = require('express');
var router = express.Router();
const Controller = require('../controllers/commentController')
const { checkUser } = require('../middlewares')

router.post('/', checkUser, Controller.create)

router.get('/:postId', Controller.findAll)
router.delete('/:id', Controller.destroy)

module.exports = router;
