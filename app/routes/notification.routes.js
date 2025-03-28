const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

router.post("/send-email", notificationController.sendEmailNotification);

module.exports = router;