const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuidv4");
const moment = require("moment-timezone");

const Booking = new Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    idDestination: {
        type: String,
        default: uuidv4,
        ref: "Destination",
    },
    name: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        required: false,
        // ref: "Destination",
        // get: (val) => moment(val).tz("Asia/Jakarta").format(),
    },
    image: {
        type: String,
        required: false,
    },
    citizenship: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    quantity: {
        type: Number,
        required: false,
    },
});

module.exports = mongoose.model("Booking", Booking);
