const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuidv4");

const Transaction = new Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    idUser: {
        type: String,
        default: uuidv4,
        ref: "User",
    },
    idAdmin: {
        type: String,
        default: uuidv4,
        ref: "User",
    },
    idBooking: {
        type: String,
        default: uuidv4,
        ref: "Booking",
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("Transaction", Transaction);
