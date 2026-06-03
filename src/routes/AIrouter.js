const express = require("express");
const authValidation = require("../middlewares/auth");
const main = require("../config/geminiApis");
const AiRouter = express.Router();

AiRouter.post("/askAi", authValidation, async (req, res) => {
  try {
    const {msg}=req.body;
    const response = await main(msg);
    res.send(response.response.text());
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = AiRouter;
