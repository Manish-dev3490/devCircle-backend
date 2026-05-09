const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = require('./routes/authRouter')
const profileRouter = require('./routes/profileRouter')



app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);



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
