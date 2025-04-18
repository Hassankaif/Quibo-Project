const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validate");

// Changed route path from "/profile/view" to "/view"
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.send("Error in fetching profile: " + err.message);
  }
});

// Changed route path from "/profile/edit" to "/edit"
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid data");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    res.send(user.firstName + " Profile updated successfully");
  } catch (err) {
    res.send("Error in updating profile: " + err.message);
  }
});

module.exports = profileRouter;