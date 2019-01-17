const Post = require('../models/Post')
const ObjectId = require('mongoose').Types.ObjectId



module.exports = {

    allPost: function (req, res) {
        Post
         .find({})
         .then((post) => {
            post.sort(function(a, b){
                return a.createdAt == b.createdAt ? 0 : +(a.createdAt > b.createdAt) || -1;
              });
            res.status(200).json({
                msg: 'success get all data',
                data: post
            })
         })
         .catch((err) => {
             res.status(500).json({
                 msg: 'internal server error',
                 error: err.message
             })
         })
         
    },

    userPost: function (req, res) {
        let UserId = ObjectId(req.params.userId)
        Post
         .find({UserId})
         .then((posts) => {
             if (posts) {
                 res.status(200).json({
                     msg: 'success get posts of one user',
                     data: posts
                 })
             } else {
                 res.status(404).json({
                     msg: 'user not found'
                 })
             }
         })
         .catch((err) => {
             res.status(500).json({
                 msg: 'internal server error',
                 error: err.message
             })
         })

    },

    onePost: function (req, res) {
        Post
         .findById(req.params.id).populate('User').exec()
         .then((post) => {
             if (post) {
                 res.status(200).json({
                     msg: 'success get one post',
                     data: post
                 })
             } else {
                 res.status(404).json({
                     msg: 'post not found',
                 })
             }
         })
         .catch((err) => {
             res.status(500).json({
                 msg: 'internal server error',
                 error: err.message
             })
         })
    },

    createPost: function (req, res) {
        let insert = {
            image: req.body.image,
            UserId: req.current.id,
            caption: req.body.caption,
        }
        Post
         .create(insert)
         .then((post) => {
             res.status(201).json({
                 msg: 'success create post',
                 data: post
             })
         })
         .catch((err) => {
             res.status(500).json({
                 msg: 'internal server error',
                 error: err.message
             })
         })
    },

    update: function (req, res) {
        let insert = {
            caption: req.body.caption,
            like: req.body.like
        }
        for (let i in insert) {
            if (insert[i] == undefined) {
                delete insert[i]
            }
        }
        let id = ObjectId(req.params.id)
        Post
         .findOneAndUpdate({_id:id}, insert, {new:true})
         .then((post) => {
             res.status(201).json({
                 msg:`success update post with id ${req.params.id}`,
                 data: post
             })
         })
         .catch((err) => {
             res.status(500).json({
                 msg:'internal server error',
                 error: err.message
             })
         })
    },

    destroy: function (req, res) {
        let id = ObjectId(req.params.id)
        Post
         .deleteOne({_id:id})
         .then((post) => {
             if (post.n === 0) {
                 res.status(404).json({
                     msg: 'post not found'
                 })
             } else {
                 res.status(200).json({
                     msg: ' success delete post',
                     data: {id: req.params.id}
                 })
             }
         })
         .catch((err) => {
             res.status(500).json({
                 msg: 'internal server error',
                 error: err.message
             })
         })

    }
} 