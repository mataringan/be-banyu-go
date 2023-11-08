const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const Destination = new Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    title: {
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
    openingTime: {
        type: Date,
        required: false,
    },
    closingTime: {
        type: Date,
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
