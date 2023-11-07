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
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    openingTime: {
        type: Date,
        required: true,
    },
    closingTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    ticketPrice: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Destination", Destination);
