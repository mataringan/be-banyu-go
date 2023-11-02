const express = require("express");
const { handleRoot } = require("../controllers/root");

const router = express.Router();

router.get("/", handleRoot);

module.exports = router;
