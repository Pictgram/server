const Router = require('express').Router()
const postController = require('../controllers/postController')


Router.get('/', postController.allPost)
Router.post('/', postController.createPost)
Router.get('/:userId', postController.userPost)
Router.get('/:id', postController.onePost)
Router.delete('/:id', postController.destroy)
Router.put('/:id', postController.update)


module.exports = Router