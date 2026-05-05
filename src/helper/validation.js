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

    if (!validator.isStrongPassword(password)) throw new Error("please enter the strong password");

    // 👉 ye hamesha chalega agar email valid hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("user email already exists");
    }
}

function validateLoginAPI(req) {

    const { email, password } = req.body;
    if (!email) throw new Error("please enter the email");

    if (!password) throw new Error("please enter the  password");

    
    if (!validator.isEmail(email)) {
        throw new Error("please enter the valid email");
    }


}

async function validateUserPatchApi(req){
    const{_id,email}=req.body;
    if(!_id)throw new Error("please send the id of user you want to update");
    const properEmail = email?.trim();
    if(!(properEmail && validator.isEmail(properEmail)))throw new Error("your email is not valid");
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new Error("this user does not exist ");
    }

    


}
module.exports = {
    validateSignUpAPI,
    validateLoginAPI,
    validateUserPatchApi
}