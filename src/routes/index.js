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
    getDestinationByOfficer,
} = require("../controllers/destinationController");
const {
    createInformationDestination,
    getInformationDestinationById,
    getAllInformationDestination,
    updateInformationDestination,
    deleteInformationDestination,
    getInformationDestinationAdmin,
} = require("../controllers/informationDestinationController");
const {
    createBooking,
    getBookingEmail,
    getBookingById,
} = require("../controllers/bookingController");
const {
    getTransactionById,
    updateStatusTransaction,
    getAllTransaction,
    updateTransaction,
    getTransactionEmail,
    deleteTransaction,
    getAllTransactionAdmin,
    getAllTransactionAdminUnVerifikasi,
    getTransactionByUser,
} = require("../controllers/transactionController");
const {
    createUser,
    getUserByQuery,
    getUserById,
    updateUser,
    updateUserWithToken,
    deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", handleRoot);

router.post("/register", register);

router.post("/register-admin", authorize, registerAdmin);

router.post("/register-user", authorize, createUser);

router.put("/verify-user", verifyUser);

router.post("/resend-otp", resendOTP);

router.get("/user", authorize, getUserByQuery);

router.get("/user/:id", authorize, getUserById);

router.put("/user/:id", authorize, updateUser);

router.put("/user", validator, authorize, updateUserWithToken);

router.delete("/user/:id", authorize, deleteUser);

router.post("/login", login);

router.get("/whoami", authorize, whoami);

router.post("/destination", validator, authorize, createDestination);

router.get("/destination", getDestinationByQuery);

router.get("/destination-admin", authorize, getDestinationByOfficer);

router.get("/destination/:id", getDestinationById);

router.put("/destination/:id", validator, authorize, updateDestination);

router.delete("/destination/:id", authorize, deleteDestination);

router.post(
    "/information-destination",
    authorize,
    createInformationDestination
);

router.get("/information-destination/:id", getInformationDestinationById);

router.get("/information-destination", getAllInformationDestination);

router.get(
    "/information-destination-admin",
    authorize,
    getInformationDestinationAdmin
);

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

router.post("/booking", validator, authorize, createBooking);

// router.post("/email-booking", authorize, getBookingEmail);

// router.get("/booking/:_id", authorize, getBookingById);

router.get("/transaction", authorize, getAllTransaction);

router.get("/transaction/:id", authorize, getTransactionById);

router.get("/transaction-admin", authorize, getAllTransactionAdmin);

router.get(
    "/transaction-admin-unverifikasi",
    authorize,
    getAllTransactionAdminUnVerifikasi
);

router.get("/transaction-user", authorize, getTransactionByUser);

router.post("/email-transaction", authorize, getTransactionEmail);

router.put("/transaction/:id", authorize, updateTransaction);

router.put("/transaction-status", authorize, updateStatusTransaction);

router.delete("/transaction/:id", authorize, deleteTransaction);

module.exports = router;
