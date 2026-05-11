const validator = require('validator');
const User = require('../models/user')
const mongoose = require('mongoose')

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

async function validateProfileEditApi(req) {
    const allowedUpdates = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photo",
        "address",
    ];

    // ✅ check only allowed fields are updated
    const isAllowed = Object.keys(req.body).every((field) =>
        allowedUpdates.includes(field)
    );

    if (!isAllowed) {
        throw new Error("You cannot update email or password");
    }

    const {
        firstName,
        lastName,
        age,
        gender,
        photo,
        address,
    } = req.body;

    // ✅ firstName validation
    if (firstName !== undefined) {
        if (
            typeof firstName !== "string" ||
            firstName.trim().length < 3 ||
            firstName.trim().length > 50
        ) {
            throw new Error("First name should be between 3 to 50 characters");
        }
    }

    // ✅ lastName validation
    if (lastName !== undefined) {
        if (
            typeof lastName !== "string" ||
            lastName.trim().length < 3 ||
            lastName.trim().length > 50
        ) {
            throw new Error("Last name should be between 3 to 50 characters");
        }
    }

    // ✅ age validation
    if (age !== undefined) {
        if (typeof age !== "number" || age < 18 || age > 70) {
            throw new Error("Please enter a valid age");
        }
    }

    // ✅ gender validation
    if (gender !== undefined) {
        const validGenders = ["male", "female", "others"];

        if (!validGenders.includes(gender.toLowerCase())) {
            throw new Error("Please enter a valid gender");
        }
    }

    // ✅ photo validation
    if (photo !== undefined) {
        if (!validator.isURL(photo)) {
            throw new Error("Photo should be a valid URL");
        }
    }

    // ✅ address validation
    if (address !== undefined) {
        if (
            typeof address !== "string" ||
            address.trim().length < 5 ||
            address.trim().length > 200
        ) {
            throw new Error("Please enter a valid address");
        }
    }
}


async function sendConnectionApi(req) {

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;


    if (!mongoose.Types.ObjectId.isValid(fromUserId)) throw new Error("fromuserId id is not valid");
    if (!mongoose.Types.ObjectId.isValid(toUserId)) throw new Error("toUserId id is not valid");

    if (fromUserId == toUserId) throw new Error(`${req.user.firstName} you are not allowed to send request to youserlf`);

    const allowedStatus = ["intrested", "ignored"];
    if (!allowedStatus.includes(status)) throw new Error("status is not valid");

    const isToUserExistInDb = await User.findById(toUserId);
    if (isToUserExistInDb === null) throw new Error(`${req.user.firstName} your are sending request to invalid user`);
    req.toUser=isToUserExistInDb;


}


module.exports = {
    validateSignUpAPI,
    validateLoginAPI,
    validateProfileEditApi,
    sendConnectionApi
}