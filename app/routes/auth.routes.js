const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post(
  "/signin", 
  authController.signin);
router.post(
  "/refreshToken", 
  authController.refreshToken);
router.post(
  "/logout",
  authController.logout);

module.exports = (app) => {
  app.use("/api/auth", router);
};
