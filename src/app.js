const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = require('./routes/authRouter')
const profileRouter = require('./routes/profileRouter')
const redisClient = require('./config/redis');
const connectionRequestRouter=require('./routes/request')
const userRouter=require('./routes/userRouter');



app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/",connectionRequestRouter)
app.use("/",userRouter);



async function initializeConnection() {

  try {
    await connectDB();
    console.log("connected with mongoDb cluster");

    await redisClient.connect();
    console.log("connected with redis database");

      app.listen(3000, () => {
      console.log("server is listening on the port 3000");
    })

  }
  catch (error) {
    console.log("something went wrong " + error.message);

  }
}

initializeConnection();