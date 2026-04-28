const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user')
const app = express();


app.use(express.json());

app.post("/signup", async (req, res) => {
    const dataobj = new User(req.body)

    try {
        await dataobj.save();
        res.send("User created successfully");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
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


