const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user')
const app = express();



app.post("/signup", async (req, res) => {
    const dataobj = {
        firstName: "manish",
        lastName: "kumar",
        age: 22,
        email: "manish@gmail.com",
        password: "1234556789",
        address: "delhi"
    };

    await User.create(dataobj);

    res.send("User created successfully");
});


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


