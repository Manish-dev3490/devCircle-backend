const validator = require('validator');


function validateSignUpAPI(req) {

    const { firstName, lastName, email, password ,age} = req.body;

    if (!firstName || !lastName) throw new Error("please enter your name");
    if (!(firstName.length >= 3 && firstName.length <= 50) || !(lastName.length >= 3 && lastName.length <= 50)) {
        throw new Error("please check length of your name properly");
    }

    if (!validator.isEmail(email)) {
        throw new Error("please enter the valid email");
    }

    if (!validator.isStrongPassword(password)) throw new Error("please eneter the strong password");
}



module.exports={
    validateSignUpAPI
}