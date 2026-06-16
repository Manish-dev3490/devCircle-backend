const socket = require("socket.io");


const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        },
    })


    io.on("connection", (socket) => {
        console.log("New User Connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("User Disconnected:", socket.id);
        });
    });
}
module.exports = initializeSocket;