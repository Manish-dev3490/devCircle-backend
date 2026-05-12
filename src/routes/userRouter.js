const express = require("express");
const authValidation = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

// api to recieve the connection requests
userRouter.get("/user/requests/recieved", authValidation, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requestrecived = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "intrested",
        }).populate("fromUserId", ["firstName", "lastName", "age", "photo"]);

        if (!requestrecived) throw new Error("you have got no connection request");
        res.json({ message: `Data fetched successfully `, data: requestrecived });
    } catch (error) {
        res.status(400).send("Error  " + error.message);
    }
});

module.exports = userRouter;
