const mongoose = require("mongoose");

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
        lowercase:true

    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 25,
        trim: true

    },
    address: {
        type: String,
        required: true,
        trim: true

    },
    gender: {
        type: String,
        required: true,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("your gender is not valid");
            }
        }
    },
    photo: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/avatar-man-icon-profile-placeholder-anonymous-user-male-gray-person-identity-373371403.jpg?w=768"
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
