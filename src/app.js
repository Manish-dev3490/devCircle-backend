const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validate = require("./helper/validation");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jsonwebtoken = require('jsonwebtoken')
const authValidator=require('./middlewares/auth')
const app = express();

app.use(cookieParser());
app.use(express.json());


// post api for signup new user into database
app.post("/signup", async (req, res) => {
  try {
    // validate the data at the api level validation
    await validate.validateSignUpAPI(req);

    // encrypting the password with bcrypt library
    const { firstName, lastName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const newClient = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await newClient.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});


// login api to login user
app.post("/login", async (req, res) => {
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
      const token = jsonwebtoken.sign(
        { _id: user._id },
        "$foobar$"
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      });
      res.status(200).send("Login Successfully");
    }



  } catch (error) {
    res.status(401).send(error.message);
  }
});


// api to profile
app.get("/profile", authValidator,async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(401).send("Invalid token");
  }
});


connectDB()
  .then(() => {
    console.log("successfully connected with cluster");
    app.listen(3000, () => {
      console.log("i am listning on the port 3000");
    });
  })
  .catch((error) => {
    console.log("your connection is not established because of " + error);
  });
