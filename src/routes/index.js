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

const router = express.Router();

router.get("/", handleRoot);

router.post("/register", register);

router.post("/register-admin", authorize, registerAdmin);

router.put("/verify-user", verifyUser);

router.post("/resend-otp", resendOTP);

router.post("/login", login);

router.get("/whoami", authorize, whoami);

module.exports = router;
