const socket = require("socket.io");
const chatModel = require("../models/chat")
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: process.env.client_URL,
            credentials: true
        },
    })


    // 👇 Authentication Middleware
    io.use(async (socket, next) => {
        try {
            const cookies = socket.handshake.headers.cookie;

            if (!cookies) {
                return next(new Error("Token not found"));
            }

            // cookies = "token=eyJhbGcOiJIUzI1NiIs..."
            const token = cookies.split("=")[1];

            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);


            const user = await User.findById(payload._id);
            if (!user) return next(new Error("user not found"));
            socket.user = user;

            next();
        } catch (error) {
            console.log(error.message);
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        console.log("New User Connected:", socket.id);


        // chat ko join krne vaala event hai yah room banega 
        socket.on("join-chat", async ({ firstName, firstUserId, toUserId }) => {
            try {



                const connection = await ConnectionRequestModel.findOne({
                    status: "accepted",
                    $or: [
                        {
                            fromUserId: firstUserId,
                            toUserId: toUserId
                        },
                        {
                            fromUserId: toUserId,
                            toUserId: firstUserId
                        }
                    ]
                });

                if (!connection) {
                    throw new Error("You are not authorized to join this chat");
                }

                const roomId = [firstUserId, toUserId].sort().join("_");

                socket.join(roomId);

                console.log(`${firstName} joined the chat ${roomId}`);

            }
            catch (error) {
                console.log(error.message);

                socket.emit("chat-error", {
                    message: error.message
                });
            }
        })


        // message ko recive krega yeh event and yaha db mein save karvana hai 
        socket.on("send-message", async ({ _id, toUserId, firstName, text ,lastName}) => {
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

                chat.messages.push({ senderId: _id, text });
                await chat.save();
                io.to(roomId).emit("new-message", { firstName, text ,lastName});
            }
            catch (error) {
                console.log(error.message);
            }

        })


        socket.on("typing-message", ({ toUserId, _id, firstName }) => {

            const roomId = [_id, toUserId]
                .sort()
                .join("_");

            socket.to(roomId).emit("typing-message", {
                firstName
            });

        });


        socket.on("stop-typing", ({_id, firstName, toUserId }) => {

            const roomId = [_id, toUserId]
                .sort()
                .join("_");


            socket.to(roomId).emit("stop-typing", {
                firstName,
            });

        });

    });
}
module.exports = initializeSocket;