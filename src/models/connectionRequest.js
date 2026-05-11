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


const ConnectionRequestModel = new mongoose.model("Connectionrequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;