const express = require("express");
const router = express.Router();
const countController = require("../controllers/count.controller");

router.get("/counts", countController.getCounts);

module.exports = router;