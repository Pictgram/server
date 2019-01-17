const User = require('../models/User')
const { decode } = require('../helpers')

module.exports = {
    checkUser: function(req, res, next) {
        if (!req.headers.token) {
            res.status(403).json({
                msg: `Login first`
            })
        } else {
            try {
                var decoded = decode(req.headers.token)

                User.findById(decoded.id)
                    .then(found => {
                        if (!found) {
                            res.status(404).json({
                                msg: `User not found`
                            })
                        } else {
                            req.current = decoded.id
                            next()
                        }
                    })
            } catch(err) {
                res.status(404).json({
                    msg: `Token is not valid`
                })
            }
        }
    }
}