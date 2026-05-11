const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Types.ObjectId.isValid,
        required: true
    },
    toUserId: {
        type: mongoose.Types.ObjectId.isValid,
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

})


const ConnectionRequestModel = new mongoose.model("Connectionrequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;