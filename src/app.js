const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

// find one user with email id
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});


// post api for signup new user into database
app.post("/signup", async (req, res) => {
  

  try {
    await User.create(req.body);
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});


// api to find all users in users colleection
app.get("/feed", async (req, res) => {
  try {
    const feed = await User.find({});
    res.send(feed);
    console.log(feed);
  }
  catch (error) {
    res.status(404).send("something went wrong" + error)
  }
})


// api to delete a user from database
app.delete("/user", async (req, res) => {
  
  try {
    await User.findByIdAndDelete({_id:req.body._id});
    res.send("user is deleted");
  }
  catch (error) {
    res.status(404).send("something went wrong " + error);
  }
})


// api to update a particular user by  his details
app.patch("/user",async(req,res)=>{
  try{
     await User.findByIdAndUpdate({_id:req.body._id},{firstName:req.body.firstName,email:req.body.email},{runValidators:true});
     res.send("user is updated");
  }
  catch(error){
    res.status(404).send("something went wrong"+error);
  }
})

connectDB()
  .then(() => {
    console.log("successfully connected with cluster");
    app.listen(3000, () => {
      console.log("i am listning on the port 3000");
    });
  })
  .catch((error) => {
    console.log("your connection is not established because of " + error);
  });
