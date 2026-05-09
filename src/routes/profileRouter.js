const express = require('express');
const authValidator = require('../middlewares/auth')
const validate = require("../helper/validation");



const profileRouter = express.Router();


// api to view profile
profileRouter.get("/profile/view", authValidator, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(401).send("Invalid token");
  }
});


profileRouter.patch("/profile/edit", authValidator, async (req, res) => {
  try {
    await validate.validateProfileEditApi(req);
    const Loggeduser = req.user;

    Object.keys(req.body).forEach((key) => {
      Loggeduser[key] = req.body[key];
    })
    Loggeduser.save();

    res.status(201).json({
      message: `${Loggeduser.firstName + " " + Loggeduser.lastName} your profile is updated successfully`,
      data: Loggeduser
    })
  }
  catch (error) {
    res.status(401).send("something went wrong " + error);
  }

})

module.exports = profileRouter;