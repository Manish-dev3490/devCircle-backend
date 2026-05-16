const express = require('express');
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validate = require("../helper/validation");
const authValidation = require('../middlewares/auth');
const redisClient = require('../config/redis');
const jwt = require('jsonwebtoken');



// post api for signup new user into database
authRouter.post("/signup", async (req, res) => {
    try {
        // validate the data at the api level validation
        await validate.validateSignUpAPI(req);

        // encrypting the password with bcrypt library
        const { password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        req.body.password = hashPassword;

        // creating the new client 
        const newClient = User.create(req.body);
        res.status(201).send("User created successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
});


// login api to login user
authRouter.post("/login", async (req, res) => {
    try {
        validate.validateLoginAPI(req);

        const { email, password } = req.body;

        // check user exist
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        else {
            const token = await user.getJwt();

            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
            });
            res.status(200).send(user);
        }



    } catch (error) {
        res.status(401).send(error.message);
    }
});


// logout api to logout the user
authRouter.post("/logout", authValidation, async (req, res) => {

    const { token } = req.cookies;
    const payload = jwt.decode(token);
    await redisClient.set(`token:${token}`, "blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp)
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("logged out successfully");
})

module.exports = authRouter;