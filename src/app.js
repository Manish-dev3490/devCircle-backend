const express = require('express');
const connectDB = require('./config/database');
const app = express();


connectDB()
    .then(() => {
        console.log("successfully connected with cluster");
        app.listen(3000, () => {
            console.log("i am listning on the prot 3000");
        })
    })
    .catch((error) => {
        console.log(("your connection is not established because of " + error));
    })


