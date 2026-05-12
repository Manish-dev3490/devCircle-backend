const express = require("express");
const authValidation = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();
const usersafeData = ["firstName", "lastName", "age", "photo"]

// api to recieve the connection requests
userRouter.get("/user/requests/recieved", authValidation, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requestrecived = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "intrested",
        }).populate("fromUserId", usersafeData);

        if (!requestrecived) throw new Error("you have got no connection request");
        res.json({ message: `Data fetched successfully `, data: requestrecived });
    } catch (error) {
        res.status(400).send("Error  " + error.message);
    }
});

// api to see all the connections/friends 
userRouter.get("/user/connections", authValidation, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const acceptedRequest = await ConnectionRequestModel.find({
            $or: [{ toUserId: loggedInUser._id, status: "accepted" },
            { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", usersafeData).populate("toUserId", usersafeData)

        if (!acceptedRequest) throw new Error("you have no connections");
        const data = acceptedRequest.map((connection) => {
            if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return connection.toUserId;
            }
            else return connection.fromUserId;
        })
        res.json({ message: 'Data fetched successfully', data: data })
    }
    catch (error) {
        res.status(400).send("Error ", error.message)
    }

})

module.exports = userRouter;
