const moongoose = require('mongoose');


const connectDB = async function () {
    
    await moongoose.connect(process.env.MONGODB_CONNECTION_URL);
}

module.exports = connectDB;