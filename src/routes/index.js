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
    getDestinationByQuery,
    updateDestination,
    deleteDestination,
} = require("../controllers/destinationController");
const {
    createInformationDestination,
    getInformationDestinationById,
    getAllInformationDestination,
    updateInformationDestination,
    deleteInformationDestination,
} = require("../controllers/informationDestinationController");
const {
    createBooking,
    getBookingEmail,
    getBookingById,
} = require("../controllers/bookingController");
const { getTransactionById } = require("../controllers/transactionController");

const router = express.Router();

router.get("/", handleRoot);

router.post("/register", register);

router.post("/register-admin", authorize, registerAdmin);

router.put("/verify-user", verifyUser);

router.post("/resend-otp", resendOTP);

router.post("/login", login);

router.get("/whoami", authorize, whoami);

router.post("/destination", validator, authorize, createDestination);

router.get("/destination", getDestinationByQuery);

router.get("/destination/:_id", getDestinationById);

router.put("/destination/:_id", validator, authorize, updateDestination);

router.delete("/destination/:_id", authorize, deleteDestination);

router.post(
    "/information-destination",
    authorize,
    createInformationDestination
);

router.get("/information-destination/:id", getInformationDestinationById);

router.get("/information-destination", getAllInformationDestination);

router.put(
    "/information-destination/:id",
    authorize,
    updateInformationDestination
);

router.delete(
    "/information-destination/:id",
    authorize,
    deleteInformationDestination
);

router.post("/booking", authorize, createBooking);

router.post("/email-booking", authorize, getBookingEmail);

// router.get("/booking/:_id", authorize, getBookingById);

router.get("/transaction/:id", authorize, getTransactionById);

module.exports = router;
