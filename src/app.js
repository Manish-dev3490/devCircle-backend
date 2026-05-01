const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validate = require("./helper/validation");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

// find one user with email id
app.get("/user", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).send("Email query param is required");
    }
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});

// post api for signup new user into database
app.post("/signup", async (req, res) => {
  try {
    // validate the data at the api level validation
    validate.validateSignUpAPI(req);

    // encrypting the password with bcrypt library
    const { firstName, lastName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const newClient = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await newClient.save();
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
  } catch (error) {
    res.status(404).send("something went wrong" + error);
  }
});


// api to delete a user by id
app.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ check if id is provided
    if (!id) {
      return res.status(400).send("User id is required");
    }

    // ✅ check valid MongoDB id format
    const isValidId = require("mongoose").Types.ObjectId.isValid(id);
    if (!isValidId) {
      return res.status(400).send("Invalid user id");
    }

    // ✅ check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // ✅ delete user
    await User.findByIdAndDelete(id);

    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});

// api to update a particular user by  his details
app.patch("/user", async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      { _id: req.body._id },
      { firstName: req.body.firstName, email: req.body.email },
      { runValidators: true },
    );
    res.send("user is updated");
  } catch (error) {
    res.status(404).send("something went wrong" + error);
  }
});

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
