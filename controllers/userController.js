const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { compare, decode } = require('../helpers')

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

class Controller {
    static create(req, res) {
        let name = req.body.name
        let email = req.body.email
        let followers = []
        let username = req.body.username
        let password = req.body.password
        let twitterUsername = req.body.twitterUsername
        let user = {}

        if (!email || !username || !password) {
            res.status(400).json({
                msg: `Name, email, and password must be filled`
            })
        } else {
            user = {
                name, email, followers, username, password, twitterUsername
            }

            for (let i in user) {
                if (!user[i]) {
                    delete user[i]
                }
            }

            User.create(user)
                .then(created => {
                    res.status(201).json({
                        msg: `Success create user`,
                        data: created,
                        token: jwt.sign({ id: created._id }, process.env.JWT)
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        msg: `Internal server error`,
                        error: err.message
                    })
                })
        }
    }

    static update(req, res) {
        let name = req.body.name
        let email = req.body.email
        let followers = req.body.followers
        let username = req.body.username
        let password = req.body.password
        let twitterUsername = req.body.twitterUsername

        let user = {}

        if (!email || !username || !password) {
            res.status(400).json({
                msg: `Name, email, and password must be filled`
            })
        } else {
            user = {
                name, email, followers, username, password, twitterUsername
            }

            for (let i in user) {
                if (!user[i]) {
                    delete user[i]
                }
            }

            User.findById(req.current)
                .then(found => {
                    found.set(user)
                    return found.save()
                })
                .then(updated => {
                    res.status(200).json({
                        msg: `Success update user`
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        msg: `Internal server error`,
                        error: err.message
                    })
                })
        }
    }

    static findOne(req, res) {
        User.findById(req.current)
            .then(found => {
                res.status(200).json({
                    data: found
                })
            })
            .catch(err => {
                res.status(500).json({
                    msg: `Internal server error`,
                    error: err.message
                })
            })
    }

    static login(req, res) {
        let email = req.body.email
        let password = req.body.password

        if (!email || !password) {
            res.status(400).json({
                msg: `All field must be filled`
            })
        } else {
            User.findOne({ email })
                .then(found => {
                    if (!found) {
                        res.status(404).json({
                            msg: `User not found`
                        })
                    } else {
                        if (!compare(password, found.password)) {
                            res.status(400).json({
                                msg: `Wrong password / email`
                            })
                        } else {
                            res.status(200).json({
                                msg: `Success login`,
                                userData: found,
                                token: jwt.sign({ id: found._id }, process.env.JWT)
                            })
                        }
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        msg: `Internal server error`,
                        error: err.message
                    })
                })
        }
    }

    static gooSi(req, res) {
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: req.body.token,
                audience: process.env.CLIENT_ID,
            });
            const payload = ticket.getPayload();
            // const userid = payload['sub'];

            User.findOne({ email: payload.email })
                .then(found => {
                    if (found) {
                        console.log(`harusnya udah send nih disini`);

                        res.status(200).json({
                            msg: `Success login`,
                            token: jwt.sign({ id: found._id }, process.env.JWT),
                            payload: payload
                        })
                    } else {
                        return User.create({
                            email: payload.email,
                            name: payload.name
                        })
                    }
                })
                .then(created => {
                    
                    if (created) {
                        res.status(200).json({
                            msg: `Success register and login`,
                            token: jwt.sign({ id: created._id }, process.env.JWT),
                            payload: payload
                        })
                    }

                })
                .catch(err => {
                    console.log(err);

                    res.status(500).json({
                        msg: `Internal server error`,
                        error: err.message
                    })
                })
        }
        verify().catch(console.error);
    }
}

module.exports = Controller