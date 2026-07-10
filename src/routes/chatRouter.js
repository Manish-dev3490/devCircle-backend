const express = require("express");
const authValidation = require("../middlewares/auth");
const chatRouter = express.Router();
const chatModel = require("../models/chat")


chatRouter.get("/chat/:targetUserId", authValidation, async (req, res) => {
    try {
        const userId = req.user._id;
        const { targetUserId } = req.params;
        console.log("userId is "+userId+" and targetUserId is "+targetUserId);
        
        let chat = await chatModel.findOne({
            participants: {
                $all: [userId, targetUserId]
            }
        }).populate({path:"messages.senderId" , select:" firstName lastName"})

        if (!chat) {
            chat = new chatModel({
                participants: [userId, targetUserId]
            });

            await chat.save();
        }
        res.status(200).json(chat);
    }
    catch (error) {
        console.log(error);

    }
})

module.exports = chatRouter;