const express = require("express");

const router = express.Router();

router.post("/createpost", authController.login);

module.exports = router;
