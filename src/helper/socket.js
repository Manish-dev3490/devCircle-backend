const socket = require("socket.io");
const chatModel = require("../models/chat")

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        },
    })


    io.on("connection", (socket) => {
        console.log("New User Connected:", socket.id);


        // chat ko join krne vaala event hai yah room banega 
        socket.on("join-chat", ({ firstName, firstUserId, toUserId }) => {
            const roomId = [firstUserId, toUserId].sort().join("_");
            socket.join(roomId);
            console.log(firstName + " joined the chat " + roomId);
        })


        // message ko recive krega yeh event and yaha db mein save karvana hai 
        socket.on("send-message",async ({ _id, toUserId, firstName, text }) => {
            try {
                console.log(firstName + " is connected and has emitted the event send message and msg is " + text)
                const roomId = [_id, toUserId].sort().join("_");

                let chat = await chatModel.findOne({
                    participants: { $all: [_id, toUserId] }
                })

                if (!chat) {
                    chat = new chatModel({
                        participants: [_id, toUserId],
                        messages: []
                    })
                }

                chat.messages.push({senderId:_id,text});
                await chat.save();
                io.to(roomId).emit("new-message", { firstName, text });
            }
            catch (error) {
                console.log(error.message);

            }

        })
    });
}
module.exports = initializeSocket;