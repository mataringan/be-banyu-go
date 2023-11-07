const { v4: uuid } = require("uuid");
const Destination = require("../models/destinations");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
    async createDestination(req, res) {
        const {
            title,
            address,
            description,
            openingTime,
            closingTime,
            status,
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
};
