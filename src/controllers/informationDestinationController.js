const InformationDestination = require("../models/informationDestination");
const Destination = require("../models/destinations");
const { v4: uuid } = require("uuid");

module.exports = {
    async createInformationDestination(req, res) {
        try {
            const { idDestination, title, description, date } = req.body;

            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "error",
                    message: "only admin can create information destination",
                });
            }

            const destination = await Destination.findOne({
                _id: idDestination,
            });

            if (!destination) {
                return res.status(404).json({
                    status: "error",
                    message: "destination not found",
                });
            }

            InformationDestination.create({
                _id: uuid(),
                idDestination,
                idAdmin: destination.officer,
                title,
                description,
                date,
            }).then((result) => {
                res.status(200).json({
                    status: "success",
                    message: "create information destination successfully",
                    data: result,
                });
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getInformationDestinationById(req, res) {
        try {
            const _id = req.params.id;

            const destination = await InformationDestination.findOne({
                _id,
            });

            res.status(200).json({
                status: "success",
                message: "get information destination by id successfully",
                data: destination,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getAllInformationDestination(req, res) {
        try {
            const destination = await InformationDestination.find();

            res.status(200).json({
                status: "success",
                message: "get all information destination successfully",
                data: destination,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getInformationDestinationAdmin(req, res) {
        try {
            const idAdmin = req.user._id;

            const informationDestination = await InformationDestination.find({
                idAdmin,
            }).populate({
                path: "idDestination",
                select: "_id name",
            });

            const formattedData = informationDestination.map((infor) => ({
                _id: infor._id,
                title: infor.title,
                description: infor.description,
                date: infor.date,
                destination: infor.idDestination
                    ? {
                          _id: infor.idDestination._id,
                          name: infor.idDestination.name,
                      }
                    : null,
            }));

            res.status(200).json({
                status: "success",
                message: "get all information destination admin successfully",
                data: formattedData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async updateInformationDestination(req, res) {
        try {
            const _id = req.params.id;
            const { idDestination, title, description, date } = req.body;
            const destination = await InformationDestination.findOne({ _id });

            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "errpr",
                    message:
                        "only admin or super admin can update information destination",
                });
            }

            if (!destination) {
                return res.status(404).json({
                    status: "error",
                    message: "destination not found",
                });
            }

            destination.idDestination = idDestination;
            destination.idAdmin = destination.idAdmin;
            destination.title = title;
            destination.description = description;
            destination.date = date;

            await destination.save();

            res.status(200).json({
                status: "success",
                message: "update information destination successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async deleteInformationDestination(req, res) {
        try {
            const _id = req.params.id;

            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "error",
                    message:
                        "only admin or super admin can delete information destination",
                });
            }

            const destination = await InformationDestination.findByIdAndDelete({
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
