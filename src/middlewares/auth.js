const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');




async function authValidation(req, res, next) {

    try {
        const { token } = req.cookies;
        if (!token) return res.status(401).send("token is not present you need to login again");

        const isBlockedToken = await redisClient.exists(`token:${token}`);
        if (isBlockedToken) throw new Error("token is blocked please login again")

        const payload = jwt.verify(token, "$foobar$");
        if (payload?._id) {
            const user = await User.findById(payload._id);
            if (!user) throw new Error("user is not present in database");
            req.user = user;
            next();
        }
        else throw Error("token is not verified")

    }

    catch (error) {
        res.status(401).send("something went wrong " + error.message);
    }
}


module.exports = authValidation