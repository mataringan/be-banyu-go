const { v4: uuid } = require("uuid");
const Destination = require("../models/destinations");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
    async createDestination(req, res) {
        const {
            name,
            address,
            description,
            date,
            openingTime,
            closingTime,
            status,
            quota,
            ticketPrice,
        } = req.body;

        try {
            const idOfficer = req.user._id;

            const isAdmin =
                req.user.role && req.user.role.toLowerCase().includes("admin");
            // if (req.user.role !== "admin" && req.user.role !== "super admin") {
            if (!isAdmin) {
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
                            officer: idOfficer,
                            name,
                            description,
                            address,
                            date,
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

    async getDestinationByOfficer(req, res) {
        try {
            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message:
                        "only admin or super admin can access destination by admin",
                });
            }

            const _id = req.user.id;

            const destination = await Destination.find({ officer: _id });

            res.status(200).json({
                status: "success",
                message: "get data destination by officer successfully",
                data: destination,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getDestinationById(req, res) {
        try {
            const _id = req.params.id;

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
            const name = req.query.name ? req.query.name : "";
            const status = req.query.status ? req.query.status : "";
            const address = req.query.address ? req.query.address : "";

            const date = req.query.date ? req.query.date : "";

            const querySearch = {};

            if (name) {
                querySearch.name = new RegExp(name, "i");
            }
            if (status) {
                querySearch.status = new RegExp(status, "i");
            }
            if (address) {
                querySearch.address = new RegExp(address, "i");
            }

            if (date) {
                const searchDate = new Date(date); // Tanggal pencarian di zona waktu UTC

                querySearch.date = {
                    $gte: searchDate,
                    $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000),
                };
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
                name,
                address,
                description,
                date,
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

            const _id = req.params.id;
            const idOfficer = req.user._id;

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
                        destination.name = name;
                        destination.address = address;
                        destination.description = description;
                        destination.date = date;
                        destination.openingTime = openingTime;
                        destination.closingTime = closingTime;
                        destination.status = status;
                        destination.quota = quota;
                        destination.ticketPrice = ticketPrice;
                        destination.image = result.url;
                        destination.officer = idOfficer;

                        await destination.save();

                        res.status(200).json({
                            status: "success",
                            message: "destination updated successfully",
                        });
                    }
                );
            } else {
                destination.name = name;
                destination.address = address;
                destination.description = description;
                destination.date = date;
                destination.openingTime = openingTime;
                destination.closingTime = closingTime;
                destination.status = status;
                destination.quota = quota;
                destination.ticketPrice = ticketPrice;
                destination.officer = idOfficer;

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
            const _id = req.params.id;

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
