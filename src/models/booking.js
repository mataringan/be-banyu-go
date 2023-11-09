const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuidv4");

const Booking = new Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    idUser: {
        type: String,
        default: uuidv4,
        ref: "User",
    },
    idDestination: {
        type: String,
        default: uuidv4,
        ref: "Destination",
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    citizenship: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Booking", Booking);
