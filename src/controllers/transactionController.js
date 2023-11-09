const Transaction = require("../models/transaction");

module.exports = {
    async getTransactionById(req, res) {
        try {
            const _id = req.params.id;

            const transaction = await Transaction.findOne({ _id })
                .populate({
                    path: "idUser",
                    select: "name email",
                })
                .populate({
                    path: "idBooking",
                    select: "name date citizenship",
                    populate: {
                        path: "idDestination",
                        select: "name",
                    },
                })
                .select("amount status");

            const formattedData = {
                _id: transaction._id,
                user: {
                    _id: transaction.idUser._id,
                    name: transaction.idUser.name,
                    email: transaction.idUser.email,
                },
                booking: {
                    _id: transaction.idBooking._id,
                    name: transaction.idBooking.name,
                    date: transaction.idBooking.date,
                    citizenship: transaction.idBooking.citizenship,
                    destination: {
                        name: transaction.idBooking.idDestination.name,
                    },
                },
                amount: transaction.amount,
                status: transaction.status,
            };

            res.status(200).json({
                status: "success",
                message: "get transaction by id successfully",
                data: formattedData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },
};
