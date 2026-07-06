const express = require('express');
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validate = require("../helper/validation");
const authValidation = require('../middlewares/auth');
const redisClient = require('../config/redis');
const jwt = require('jsonwebtoken');



authRouter.post("/signup", async (req, res) => {
    try {
        await validate.validateSignUpAPI(req);

        const { password } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);

        req.body.password = hashPassword;

        // IMPORTANT
        const newClient = await User.create(req.body);

        const token = await newClient.getJwt();

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        res.status(201).json({
            message: "User created successfully",
            data: newClient,
        });

    } catch (error) {
        res.status(400).send("Backend Error" + error.message);
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
                secure: true,
                sameSite: "none",
            });
            res.status(200).send(user);

        }





    } catch (error) {
        console.log(error.message);

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