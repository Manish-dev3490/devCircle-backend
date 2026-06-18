const socket = require("socket.io");


const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        },
    })


    io.on("connection", (socket) => {
        console.log("New User Connected:", socket.id);


        // chat ko join krne vaala event hai yah room banega 
        socket.on("join-chat", ({firstName, firstUserId, toUserId }) => {
            const roomId = [firstUserId, toUserId].sort().join("_");
            socket.join(roomId);
            console.log(firstName + " joined the chat " + roomId);
        })


        // message ko recive krega yeh event 
        socket.on("send-message", ({ _id, toUserId, firstName, text }) => {
            console.log(firstName + " is connected and has emitted the event send message and msg is " + text)
            const roomId=[_id,toUserId].sort().join("_");
            io.to(roomId).emit("new-message",{firstName,text});

        })
    });
}
module.exports = initializeSocket;