const Transaction = require("../models/transaction");
const Booking = require("../models/booking");
const Destination = require("../models/destinations");
const { sendTransactionDataByEmail } = require("./emailController");

module.exports = {
    async getAllTransaction(req, res) {
        try {
            if (req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "error",
                    message: "only super admin can get all transaction",
                });
            }
            const transaction = await Transaction.find()
                .populate({
                    path: "idUser",
                    select: "name email",
                })
                .populate({
                    path: "idBooking",
                    select: "name email phone citizenship quantity date",
                    populate: {
                        path: "idDestination",
                        select: "_id name",
                    },
                })
                .select("amount status");

            const formattedData = transaction.map((trans) => ({
                _id: trans._id,
                user: trans.idUser
                    ? {
                          _id: trans.idUser._id,
                          name: trans.idUser.name,
                          email: trans.idUser.email,
                      }
                    : null,
                booking: trans.idBooking
                    ? {
                          _id: trans.idBooking._id,
                          name: trans.idBooking.name,
                          email: trans.idBooking.email,
                          phone: trans.idBooking.phone,
                          quantity: trans.idBooking.quantity,
                          date: trans.idBooking.date,
                          citizenship: trans.idBooking.citizenship,
                          image: trans.idBooking.image,
                          destination: trans.idBooking.idDestination
                              ? {
                                    _id: trans.idBooking.idDestination._id,
                                    name: trans.idBooking.idDestination.name,
                                }
                              : null,
                      }
                    : null,
                amount: trans.amount,
                status: trans.status,
            }));

            res.status(200).json({
                status: "success",
                message: "get all transaction successfully",
                data: formattedData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getAllTransactionAdmin(req, res) {
        try {
            const idAdmin = req.user._id;

            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "error",
                    message:
                        "only admin or super admin can get all transaction",
                });
            }
            const transaction = await Transaction.find({ idAdmin })
                .populate({
                    path: "idUser",
                    select: "name email",
                })
                .populate({
                    path: "idBooking",
                    select: "name email phone citizenship quantity date",
                    populate: {
                        path: "idDestination",
                        select: "_id name",
                    },
                })
                .select("amount status");

            const formattedData = transaction.map((trans) => ({
                _id: trans._id,
                user: trans.idUser
                    ? {
                          _id: trans.idUser._id,
                          name: trans.idUser.name,
                          email: trans.idUser.email,
                      }
                    : null,
                booking: trans.idBooking
                    ? {
                          _id: trans.idBooking._id,
                          name: trans.idBooking.name,
                          email: trans.idBooking.email,
                          phone: trans.idBooking.phone,
                          quantity: trans.idBooking.quantity,
                          date: trans.idBooking.date,
                          citizenship: trans.idBooking.citizenship,
                          image: trans.idBooking.image,
                          destination: trans.idBooking.idDestination
                              ? {
                                    _id: trans.idBooking.idDestination._id,
                                    name: trans.idBooking.idDestination.name,
                                }
                              : null,
                      }
                    : null,
                amount: trans.amount,
                status: trans.status,
            }));

            res.status(200).json({
                status: "success",
                message: "get all transaction successfully",
                data: formattedData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getTransactionByUser(req, res) {
        try {
            const idUser = req.user._id;

            const transaction = await Transaction.find({ idUser })
                .populate({
                    path: "idUser",
                    select: "name email",
                })
                .populate({
                    path: "idBooking",
                    select: "name email phone citizenship quantity date",
                    populate: {
                        path: "idDestination",
                        select: "_id name",
                    },
                })
                .select("amount status");

            const formattedData = transaction.map((trans) => ({
                _id: trans._id,
                user: trans.idUser
                    ? {
                          _id: trans.idUser._id,
                          name: trans.idUser.name,
                          email: trans.idUser.email,
                      }
                    : null,
                booking: trans.idBooking
                    ? {
                          _id: trans.idBooking._id,
                          name: trans.idBooking.name,
                          email: trans.idBooking.email,
                          phone: trans.idBooking.phone,
                          quantity: trans.idBooking.quantity,
                          date: trans.idBooking.date,
                          citizenship: trans.idBooking.citizenship,
                          image: trans.idBooking.image,
                          destination: trans.idBooking.idDestination
                              ? {
                                    _id: trans.idBooking.idDestination._id,
                                    name: trans.idBooking.idDestination.name,
                                }
                              : null,
                      }
                    : null,
                amount: trans.amount,
                status: trans.status,
            }));

            res.status(200).json({
                status: "success",
                message: "get transaction by user successfully",
                data: formattedData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getAllTransactionAdminUnVerifikasi(req, res) {
        try {
            const idAdmin = req.user._id;

            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "error",
                    message:
                        "only admin or super admin can get all transaction",
                });
            }
            const transaction = await Transaction.find({
                idAdmin,
                status: "belum terverifikasi",
            })
                .populate({
                    path: "idUser",
                    select: "name email",
                })
                .populate({
                    path: "idBooking",
                    select: "name email phone citizenship quantity date",
                    populate: {
                        path: "idDestination",
                        select: "_id name",
                    },
                })
                .select("amount status");

            const formattedData = transaction.map((trans) => ({
                _id: trans._id,
                user: trans.idUser
                    ? {
                          _id: trans.idUser._id,
                          name: trans.idUser.name,
                          email: trans.idUser.email,
                      }
                    : null,
                booking: trans.idBooking
                    ? {
                          _id: trans.idBooking._id,
                          name: trans.idBooking.name,
                          email: trans.idBooking.email,
                          phone: trans.idBooking.phone,
                          quantity: trans.idBooking.quantity,
                          date: trans.idBooking.date,
                          citizenship: trans.idBooking.citizenship,
                          image: trans.idBooking.image,
                          destination: trans.idBooking.idDestination
                              ? {
                                    _id: trans.idBooking.idDestination._id,
                                    name: trans.idBooking.idDestination.name,
                                }
                              : null,
                      }
                    : null,
                amount: trans.amount,
                status: trans.status,
            }));

            res.status(200).json({
                status: "success",
                message: "get all transaction successfully",
                data: formattedData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

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
                    select: "name email phone citizenship quantity status date",
                    populate: {
                        path: "idDestination",
                        select: "_id name",
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
                    email: transaction.idBooking.email,
                    phone: transaction.idBooking.phone,
                    quantity: transaction.idBooking.quantity,
                    date: transaction.idBooking.date,
                    citizenship: transaction.idBooking.citizenship,
                    destination: {
                        _id: transaction.idBooking.idDestination._id,
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

    async getTransactionEmail(req, res) {
        try {
            const idTransaction = req.body.idTransaction;

            const transaction = await Transaction.findOne({
                _id: idTransaction,
            });

            const booking = await Booking.findOne({
                _id: transaction.idBooking,
            });

            const destination = await Destination.findOne({
                _id: booking.idDestination,
            });

            const utcDate = new Date(booking.date);
            const utcDateString = utcDate.toUTCString();

            const htmlData = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            .invoice {
                width: 80%;
                margin: 0 auto;
                border: 1px solid #ccc;
                padding: 20px;
            }
            .invoice-header {
                text-align: center;
            }
            .invoice-title {
                font-size: 24px;
            }
            .invoice-details {
                margin-top: 20px;
            }
            .invoice-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            .invoice-table th, .invoice-table td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
            }
            .invoice-total {
                text-align: right;
            }
        </style>
    </head>
    <body>
        <div class="invoice">
            <div class="invoice-header">
                <div class="invoice-title">Invoice for Your Recent Transaction</div>
            </div>
            <div class="invoice-details">
                <p>ID Transaksi: ${transaction._id}</p>
                <p>Destinasi: ${destination.name}</p>
                <p>Pembeli: ${booking.name}</p>
                <p>Tanggal: ${utcDateString}</p>
                <p>Status: ${transaction.status}</p>
            </div>
            <table class="invoice-table">
                <tr>
                    <th>Jumlah</th>
                    <th>Total Harga</th>
                </tr>
                <tr>
                    <td>${booking.quantity}</td>
                    <td>${transaction.amount}</td>
                </tr>
            </table>
            <div class="invoice-total">
                <p><strong>Total Harga: ${transaction.amount}</strong></p>
            </div>
        </div>
    </body>
    </html>
  `;
            sendTransactionDataByEmail(booking.email, htmlData);

            res.status(200).json({
                status: "success",
                message: "get transaction email success, please check email",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async updateStatusTransaction(req, res) {
        try {
            const { _id } = req.body;

            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "error",
                    message:
                        "only admin or super admin can update status transaction",
                });
            }

            const transaction = await Transaction.findOne({ _id });

            if (!transaction) {
                return res.status(404).json({
                    status: "error",
                    message: "transaction not found",
                });
            }

            const booking = await Booking.findOne({
                _id: transaction.idBooking,
            });

            const destination = await Destination.findOne({
                _id: booking.idDestination,
            });

            transaction.status = "terverifikasi";

            await transaction.save();

            const utcDate = new Date(booking.date);
            const utcDateString = utcDate.toUTCString();

            const htmlData = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            .invoice {
                width: 80%;
                margin: 0 auto;
                border: 1px solid #ccc;
                padding: 20px;
            }
            .invoice-header {
                text-align: center;
            }
            .invoice-title {
                font-size: 24px;
            }
            .invoice-details {
                margin-top: 20px;
            }
            .invoice-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            .invoice-table th, .invoice-table td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
            }
            .invoice-total {
                text-align: right;
            }
        </style>
    </head>
    <body>
        <div class="invoice">
            <div class="invoice-header">
                <div class="invoice-title">Invoice for Your Recent Transaction</div>
            </div>
            <div class="invoice-details">
                <p>ID Transaksi: ${transaction._id}</p>
                <p>Destinasi: ${destination.name}</p>
                <p>Pembeli: ${booking.name}</p>
                <p>Tanggal: ${utcDateString}</p>
                <p>Status: ${transaction.status}</p>
            </div>
            <table class="invoice-table">
                <tr>
                    <th>Jumlah</th>
                    <th>Total Harga</th>
                </tr>
                <tr>
                    <td>${booking.quantity}</td>
                    <td>${transaction.amount}</td>
                </tr>
            </table>
            <div class="invoice-total">
                <p><strong>Total Harga: ${transaction.amount}</strong></p>
            </div>
        </div>
    </body>
    </html>
  `;
            sendTransactionDataByEmail(booking.email, htmlData);

            res.status(200).json({
                status: "success",
                message:
                    "update status transaction success, please check email",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async updateTransaction(req, res) {
        try {
            const { idDestination, name, phone, email, quantity, status } =
                req.body;

            const _id = req.params.id;

            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin or super admin can update transaction",
                });
            }

            const destination = await Destination.findOne({
                _id: idDestination,
            });

            const transaction = await Transaction.findOne({ _id });

            const booking = await Booking.findOne({
                _id: transaction.idBooking,
            });

            booking.idDestination = idDestination;
            booking.date = new Date();
            booking.name = name;
            booking.phone = phone;
            booking.email = email;
            booking.quantity = quantity;

            const totalAmount = quantity * destination.ticketPrice;

            transaction.amount = totalAmount;
            transaction.status = status;

            await booking.save();
            await transaction.save();

            res.status(200).json({
                status: "success",
                message: "update transaction successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async deleteTransaction(req, res) {
        try {
            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin or super admin can delete transaction",
                });
            }

            const _id = req.params.id;

            const transaction = await Transaction.findByIdAndDelete({ _id });

            if (!transaction) {
                return res.status(404).json({
                    status: "error",
                    message: "data transaction not found",
                });
            }

            res.status(200).json({
                status: "success",
                message: "transaction delete successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },
};
