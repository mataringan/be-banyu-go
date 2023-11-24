const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");
const moment = require("moment-timezone");

const Destination = new Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    officer: {
        type: String,
        default: uuidv4,
    },
    name: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    quota: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        required: false,
    },
    openingTime: {
        type: String,
        required: false,
    },
    closingTime: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    ticketPrice: {
        type: Number,
        required: false,
    },
});

module.exports = mongoose.model("Destination", Destination);
