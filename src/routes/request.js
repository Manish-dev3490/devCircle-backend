const express = require('express');
const authValidation = require('../middlewares/auth');
const validate = require('../helper/validation');
const ConnectionRequestModel = require('../models/connectionRequest');
const connectionRequestRouter = express.Router();



// api to send the connection request
connectionRequestRouter.post("/request/send/:status/:toUserId", authValidation,async (req, res) => {

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

module.exports=connectionRequestRouter