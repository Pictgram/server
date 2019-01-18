const Router = require('express').Router()
const image = require('../helpers/index')
const postController = require('../controllers/postController')


Router.get('/', postController.allPost)
Router.post('/',image.multer.single('image'),images.sendUploadToGCS, postController.createPost)
Router.get('/:userId', postController.userPost)
Router.get('/:id', postController.onePost)
Router.delete('/:id', postController.destroy)
Router.put('/:id', postController.update)


module.exports = Router