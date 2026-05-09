const jwt = require('jsonwebtoken');
const User = require('../models/user');
async function authValidation(req, res, next) {

    try {
        const { token } = req.cookies;
        if (!token) throw new Error("token is not present you need to login again");
        const isAllowed = jwt.verify(token, "$foobar$");
        if (isAllowed?._id) {
            const user = await User.findById(isAllowed._id);
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