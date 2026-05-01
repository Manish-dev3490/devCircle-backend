const mongoose = require("mongoose");
const validator = require('validator');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 40,
        trim: true
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 40,
        trim: true
    },
    age: {
        type: Number,
        min: 18,
        max: 60,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 13,
        maxLength: 50,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("your email is invalid:" + value);
            }
        }

    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 100,
        trim: true

    },
    address: {
        type: String,
       
        trim: true

    },
    gender: {
        type: String,
        
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("your gender is not valid");
            }
        }
    },
    photo: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/avatar-man-icon-profile-placeholder-anonymous-user-male-gray-person-identity-373371403.jpg?w=768",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("your photo url is invalid:" + value);
            }
        }
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
