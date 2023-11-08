const { v4: uuid } = require("uuid");
const Destination = require("../models/destinations");
const cloudinary = require("../middleware/cloudinary");
const moment = require("moment");

module.exports = {
    async createDestination(req, res) {
        const {
            title,
            address,
            description,
            openingTime,
            closingTime,
            status,
            quota,
            ticketPrice,
        } = req.body;

        try {
            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "error",
                    message: "only admin or super admin can create destination",
                });
            }
            if (req.file == null) {
                return res.status(400).json({
                    status: "failed",
                    message: "you must input image",
                });
            } else {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;

                cloudinary.uploader.upload(
                    file,
                    {
                        folder: "destination-banyugo",
                    },
                    async function (err, result) {
                        if (!!err) {
                            return res.status(400).json({
                                status: "upload file",
                                message: err.message,
                            });
                        }
                        Destination.create({
                            _id: uuid(),
                            title,
                            description,
                            address,
                            openingTime,
                            closingTime,
                            status,
                            quota,
                            ticketPrice,
                            image: result.url,
                        })
                            .then((result) => {
                                res.status(201).json({
                                    status: "success",
                                    message: "destination created successfully",
                                    data: result,
                                });
                            })
                            .catch((err) => {
                                return res.status(400).json({
                                    status: "error",
                                    message: err.message,
                                });
                            });
                    }
                );
            }
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getDestinationById(req, res) {
        try {
            const _id = req.params._id;

            const destination = await Destination.findOne({ _id });

            res.status(200).json({
                status: "success",
                message: "get data destination by id successfully",
                data: destination,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getDestinationByQuery(req, res) {
        try {
            const title = req.query.name ? req.query.name : "";
            const status = req.query.status ? req.query.status : "";
            const address = req.query.address ? req.query.address : "";

            const openingTime = req.query.openingTime
                ? req.query.openingTime
                : "";

            const querySearch = {};

            if (title) {
                querySearch.title = new RegExp(title, "i");
            }
            if (status) {
                querySearch.status = new RegExp(status, "i");
            }
            if (address) {
                querySearch.address = new RegExp(address, "i");
            }

            if (openingTime) {
                const startDate = new Date(openingTime);
                const endDate = new Date(openingTime);
                endDate.setDate(startDate.getDate() + 1); // Set the end date to the next day

                querySearch.openingTime = { $gte: startDate, $lt: endDate }; // Use $lt to exclude the next day
            }

            const destinations = await Destination.find(querySearch);

            res.status(200).json({
                status: "success",
                message: "Get all destination by query successfully",
                data: destinations,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async updateDestination(req, res) {
        try {
            const {
                title,
                address,
                description,
                openingTime,
                closingTime,
                status,
                quota,
                ticketPrice,
            } = req.body;

            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "error",
                    message: "only admin can update destinations",
                });
            }

            const _id = req.params._id;

            const destination = await Destination.findOne({ _id });

            // if data destination not found
            if (!destination) {
                return res.status(404).json({
                    status: "error",
                    message: "destination not found",
                });
            }

            if (req.file) {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;

                cloudinary.uploader.upload(
                    file,
                    {
                        folder: "destination-banyugo",
                    },
                    async function (err, result) {
                        if (!!err) {
                            return res.status(400).json({
                                status: "upload fail",
                                message: err.message,
                            });
                        }
                        // update destination
                        destination.title = title;
                        destination.address = address;
                        destination.description = description;
                        destination.openingTime = openingTime;
                        destination.closingTime = closingTime;
                        destination.status = status;
                        destination.quota = quota;
                        destination.ticketPrice = ticketPrice;
                        destination.image = result.url;

                        await destination.save();

                        res.status(200).json({
                            status: "success",
                            message: "destination updated successfully",
                        });
                    }
                );
            } else {
                destination.title = title;
                destination.address = address;
                destination.description = description;
                destination.openingTime = openingTime;
                destination.closingTime = closingTime;
                destination.status = status;
                destination.quota = quota;
                destination.ticketPrice = ticketPrice;

                await destination.save();

                res.status(200).json({
                    status: "success",
                    message: "destination updated successfully",
                });
            }
        } catch (error) {
            return res.status(200).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async deleteDestination(req, res) {
        try {
            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(400).json({
                    status: "error",
                    message: "only admin or super admin can delete destination",
                });
            }
            const _id = req.params._id;

            const destination = await Destination.findByIdAndDelete({
                _id,
            });

            if (!destination) {
                return res.status(404).json({
                    status: "error",
                    message: "destination not found",
                });
            }
            res.status(200).json({
                status: "success",
                message: "destination deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },
};
