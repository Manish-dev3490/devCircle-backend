const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["accepted", "rejected", "intrested", "ignored"],
            message: `{VALUE} is not correct status`
        }
    }

},{timestamps:true})

connectionRequestSchema.index={fromUserId:1,toUserId:1};


const ConnectionRequestModel = new mongoose.model("Connectionrequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;