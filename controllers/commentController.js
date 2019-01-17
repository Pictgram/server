const Com= require('../models/Comment')

class Controller {

    static create (req, res) {
        let userId = req.current
        let postId = req.body.postId
        let comment = req.body.comment

        Com.create({comment, userId, postId})
            .then(created => {
                res.status(201).json({
                    msg: `Success create comment`,
                    data: created
                })
            })
            .catch(err => {
                res.status(500).json({
                    msg: `Internal server error`,
                    error: err.message
                })
            })
    }

    static findAll (req, res) {
        Com.find({postId: req.params.postId})
            .then(data => {
                res.status(200).json({
                    msg: `Success finding all comment in this post`,
                    data
                })
            })
            .catch(err => {
                res.status(500).json({
                    msg: `Internal server error`,
                    error: err.message
                })
            })
    }

    static destroy (req, res) {
        Com.findById(req.params.id) 
            .then(found => {
                if (!found) {
                    res.status(404).json({
                        msg: `Comment not found`
                    })
                } else {
                    return found.remove()
                }
            })
            .then(del => {
                res.status(200).json({
                    msg: `Success delete comment`
                })
            })
            .catch(err => {
                res.status(500).json({
                    msg: `Internal server error`,
                    error: err.message
                })
            })
    }
}
module.exports = Controller