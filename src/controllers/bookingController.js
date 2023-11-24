const Booking = require("../models/booking");
const Transaction = require("../models/transaction");
const Destination = require("../models/destinations");
const { v4: uuid } = require("uuid");
const { sendTransactionDataByEmail } = require("./emailController");
const cloudinary = require("../middleware/cloudinary");
const moment = require("moment-timezone");

module.exports = {
    async createBooking(req, res) {
        try {
            const idUser = req.user.id;
            const {
                idDestination,
                citizenship,
                name,
                phone,
                image,
                quantity,
                email,
                status,
            } = req.body;

            const destination = await Destination.findOne({
                _id: idDestination,
            });

            if (!destination) {
                return res.status(404).json({
                    status: "error",
                    message: "destination not found",
                });
            }

            if (req.file == null) {
                res.status(400).json({
                    status: "failed",
                    message: "you must input image",
                });
                return;
            }

            if (req.user.role === "admin" || req.user.role === "super admin") {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;

                cloudinary.uploader.upload(
                    file,
                    { folder: "booking-banyugo" },
                    async function (err, result) {
                        if (!!err) {
                            return res.status(400).json({
                                status: "upload fail",
                                message: err.message,
                            });
                        }

                        const booking = await Booking.create({
                            _id: uuid(),
                            idDestination,
                            name,
                            // date: new Date(),
                            date: destination.date,
                            citizenship,
                            email,
                            image: result.url,
                            phone,
                            quantity,
                        });

                        const totalAmount = destination.ticketPrice * quantity;

                        destination.quota -= quantity;

                        await destination.save();

                        const transaction = await Transaction.create({
                            _id: uuid(),
                            idBooking: booking._id,
                            idUser,
                            idAdmin: destination.officer,
                            amount: totalAmount,
                            status,
                        });

                        const utcDate = new Date(booking.date);
                        const utcDateString = utcDate.toLocaleDateString();

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
                        sendTransactionDataByEmail(email, htmlData);
                        res.status(200).json({
                            status: "success",
                            message: "create booking successfully",
                        });
                    }
                );
            } else {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;

                cloudinary.uploader.upload(
                    file,
                    { folder: "booking-banyugo" },
                    async function (err, result) {
                        if (!!err) {
                            return res.status(400).json({
                                status: "upload fail",
                                message: err.message,
                            });
                        }

                        const booking = await Booking.create({
                            _id: uuid(),
                            idDestination,
                            name,
                            // date: new Date(),
                            date: destination.date,
                            citizenship,
                            email,
                            image: result.url,
                            phone,
                            quantity,
                        });

                        const totalAmount = destination.ticketPrice * quantity;

                        destination.quota -= quantity;

                        await destination.save();

                        const transaction = await Transaction.create({
                            _id: uuid(),
                            idBooking: booking._id,
                            idUser,
                            idAdmin: destination.officer,
                            amount: totalAmount,
                            status: "belum terverifikasi",
                        });

                        const utcDate = new Date(booking.date);
                        const utcDateString = utcDate.toLocaleDateString();

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
                        sendTransactionDataByEmail(email, htmlData);
                        res.status(200).json({
                            status: "success",
                            message: "create booking successfully",
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

    // async getBookingById(req, res) {
    //     try {
    //         const _id = req.params._id;

    //         const booking = await Booking.findOne({
    //             _id,
    //         })
    //             .populate("idUser")
    //             .populate("idDestination");

    //         res.status(200).json({
    //             status: "success",
    //             message: "get data booking by id successfully",
    //             data: booking,
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             status: "error",
    //             message: error.message,
    //         });
    //     }
    // },
};
