const moongoose = require('mongoose');
const url = "mongodb+srv://kmanish87064_db_user:CodingAdda123@coding-adda.neh8o7x.mongodb.net/devCircle-data";

const connectDB = async function () {
    await moongoose.connect(url);
}

module.exports = connectDB;