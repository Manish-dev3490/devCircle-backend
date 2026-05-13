const express = require("express");
const authValidation = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
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


// api to see feed 
userRouter.get("/user/feed", authValidation, async (req, res) => {
    try {

        const loggedInUser = req.user._id;

        // pagination
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const skip = (page - 1) * limit;

        const hideTheseUsers = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser },
                { toUserId: loggedInUser }
            ]
        }).select("fromUserId toUserId status");



        const notShownInFeed = new Set();

        hideTheseUsers.forEach((user) => {
            notShownInFeed.add(user.fromUserId.toString());
            notShownInFeed.add(user.toUserId.toString());
        });

        notShownInFeed.add(loggedInUser.toString());



        const finalNotShownUsers = await User.find({
            _id: { $nin: Array.from(notShownInFeed) }
        })
            .select(usersafeData)
            .skip(skip)
            .limit(limit);



        res.send(finalNotShownUsers);

    }
    catch (error) {
        res.status(500).send("Something went wrong " + error.message);
    }
});
module.exports = userRouter;
