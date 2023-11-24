const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const InformationDestination = new Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    idDestination: {
        type: String,
        default: uuidv4,
        ref: "Destination",
    },
    idAdmin: {
        type: String,
        default: uuidv4,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model(
    "InformationDestination",
    InformationDestination
);
