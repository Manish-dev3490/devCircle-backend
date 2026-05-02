const validator = require('validator');
const User = require('../models/user')

async function validateSignUpAPI(req) {

    const { firstName, lastName, email, password, age } = req.body;

    const first = firstName?.trim();
    const last = lastName?.trim();

    if (!first || !last) {
        throw new Error("please enter your name properly");
    }

    if (first.length < 3 || first.length > 50 ||
        last.length < 3 || last.length > 50) {
        throw new Error("please check length of your name properly");
    }

    if (!validator.isEmail(email)) {
        throw new Error("please enter the valid email");
    }

    // 👉 ye hamesha chalega agar email valid hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("user email already exists");
    }
    if (!validator.isStrongPassword(password)) throw new Error("please enter the strong password");
}

function validateLoginAPI(req) {

    const { email, password } = req.body;
    if (!email) throw new Error("please enter the email");

    if (!password) throw new Error("please enter the  password");

    if (!validator.isEmail(email)) {
        throw new Error("please enter the valid email");
    }

}

module.exports = {
    validateSignUpAPI,
    validateLoginAPI
}