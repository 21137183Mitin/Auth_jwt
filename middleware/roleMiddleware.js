const jwt = require('jsonwebtoken');
const {secret} = require('../config');

module.exports = (roles) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(403).json( {message: "User is not logged in1"})
            }
            const {roles: userRoles} = jwt.verify(token, secret)
            let hasRole = false
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
                if(!hasRole) {
                    return res.status(403).json({message: "You don't have access"})
                }
            })
            next()
        } catch (e) {
            console.log("BAD",e)
            return res.status(403).json( {message: "User is not logged in2"})
        }
    }
}