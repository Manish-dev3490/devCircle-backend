const express = require('express');
const authValidation = require('../middlewares/auth');
const validate = require('../helper/validation');
const ConnectionRequestModel = require('../models/connectionRequest');
const connectionRequestRouter = express.Router();



// api to send the connection request
connectionRequestRouter.post("/request/send/:status/:toUserId", authValidation, async (req, res) => {


    try {
        // Api level validation for extra security check
        await validate.sendConnectionApi(req);

        // checking if request is already sent 
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const isExistingRequest = await ConnectionRequestModel.findOne({
            $or: [{ fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (isExistingRequest) throw new Error("request is already sent");

        // creating the reuest now
        const newConnectionRequest = new ConnectionRequestModel({ fromUserId, toUserId, status });
        const data = await newConnectionRequest.save();
        res.json({
            message: `${req.user.firstName} has ${status} in ${req.toUser.firstName} `,
            data: data
        })
    }
    catch (error) {
        res.status(404).json({
            message: `something went wrong ${error}`
        })
    }

})


// api to review the connection request accxepted /rejected
connectionRequestRouter.post("/request/review/:status/:requestId", authValidation, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) throw new Error("status is not allowed !");
        const connectionRequestExist = await ConnectionRequestModel.findOne({ _id: requestId, toUserId: loggedInUser._id, status: "intrested" });

        if (!connectionRequestExist) throw new Error("connection request is not found");
        connectionRequestExist.status = status;
        const data = await connectionRequestExist.save();
        res.json({ message: `connection request ${status}`, data: data });

    }
    catch (error) {
        res.status(400).json({ message: `Err + ${error.message}` });
    }
})





module.exports = connectionRequestRouter