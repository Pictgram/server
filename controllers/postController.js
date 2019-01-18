const Post = require('../models/Post')
const ObjectId = require('mongoose').Types.ObjectId
const OAuth = require('oauth');
var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.consumerApiKey, //consumer key
    process.env.consumerApiSecretKey, //secret
    '1.0A',
    null,
    'HMAC-SHA1'
);


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
        // console.log(req.body)
        // console.log(req.file, "==========")
        // console.log(req.file.cloudStoragePublicUrl,'ffffffffffff')
        let insert = {
            image: req.file.cloudStoragePublicUrl,
            UserId: req.body.userId,
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

    },
    shareTwit: function (req, res) {
        let image = req.body.imageUrl
        let uname = req.body.uname

        //buat ngetweetny:
        oauth.post(
        'https://api.twitter.com/1.1/statuses/update.json',
            process.env.accesstoken, //user token
            process.env.accesstokensecret, //user secret
            { status: ` @${uname} 
            want to share this image:
            
             ${image} ` },
            function(err, data) {
                if(err) {
                    res.status(500).json({
                        msg: `Internal server error`,
                        error: err.message
                    })
                } else {
                    console.log('success tweet!!!!!!!!!!!!')
                    res.status(201).json({
                        msg: `Success tweet`
                    })
                }
            }
        )
    }
} 
