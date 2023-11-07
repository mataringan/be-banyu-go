const express = require("express");
const { handleRoot } = require("../controllers/root");
const {
    register,
    registerAdmin,
    verifyUser,
    resendOTP,
    login,
    whoami,
} = require("../controllers/authController");
const { authorize } = require("../middleware/authorize");
const validator = require("../middleware/validation");
const {
    createDestination,
    getDestinationById,
} = require("../controllers/destinationController");

const router = express.Router();

router.get("/", handleRoot);

router.post("/register", register);

router.post("/register-admin", authorize, registerAdmin);

router.put("/verify-user", verifyUser);

router.post("/resend-otp", resendOTP);

router.post("/login", login);

router.get("/whoami", authorize, whoami);

router.post("/destination", validator, authorize, createDestination);

router.get("/destination/:_id", getDestinationById);

module.exports = router;
