const path = require("path");

const result = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});


const express = require("express");

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = require('./routes/authRouter')
const profileRouter = require('./routes/profileRouter')
const redisClient = require('./config/redis');
const connectionRequestRouter = require('./routes/request')
const userRouter = require('./routes/userRouter');
const rateLimmiter = require('./middlewares/rateLimmiter');
const cors = require('cors')



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(rateLimmiter)


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter)
app.use("/", userRouter);



async function initializeConnection() {

  try {
    await connectDB();
    console.log("connected with mongoDb cluster");

    await redisClient.connect();
    console.log("connected with redis database");

    app.listen(process.env.PORT, () => {
      console.log("server is listening on the port 3000");
    })

  }
  catch (error) {
    console.log("something went wrong " + error.message);

  }
}

initializeConnection();