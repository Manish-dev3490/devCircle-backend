const express=require('express');
const authValidator=require('../middlewares/auth')


const profileRouter=express.Router();


// api to view profile
profileRouter.get("/profile", authValidator,async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(401).send("Invalid token");
  }
});


module.exports=profileRouter;