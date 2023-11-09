const Booking = require("../models/booking");
const Transaction = require("../models/transaction");
const Destination = require("../models/destinations");
const { v4: uuid } = require("uuid");
const { sendTransactionDataByEmail } = require("./emailController");

module.exports = {
    async createBooking(req, res) {
        try {
            const idUser = req.user.id;
            const {
                idDestination,
                citizenship,
                name,
                phone,
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

            if (req.user.role === "admin" || req.user.role === "super admin") {
                const booking = await Booking.create({
                    _id: uuid(),
                    idDestination,
                    idUser,
                    name,
                    date: new Date(),
                    citizenship,
                    email,
                    phone,
                    quantity,
                });

                const totalAmount = destination.ticketPrice * quantity;

                destination.quota -= quantity;

                await destination.save();

                const transaction = await Transaction.create({
                    _id: uuid(),
                    idBooking: booking._id,
                    amount: totalAmount,
                    status,
                });

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
                <p>ID Transaksi: ${booking._id}</p>
                <p>Destinasi: ${destination.name}</p>
                <p>Pembeli: ${booking.name}</p>
                <p>Tanggal: ${booking.date}</p>
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
            } else {
                const booking = await Booking.create({
                    _id: uuid(),
                    idDestination,
                    idUser,
                    name,
                    citizenship,
                    email,
                    date: new Date(),
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
                    amount: totalAmount,
                    status: "belum lunas",
                });

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
                <p>ID Transaksi: ${booking._id}</p>
                <p>Destinasi: ${destination.name}</p>
                <p>Pembeli: ${booking.name}</p>
                <p>Tanggal: ${booking.date}</p>
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
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getBookingEmail(req, res) {
        try {
            const idBooking = req.body.idBooking;

            const booking = await Booking.findOne({
                _id: idBooking,
            });

            const destination = await Destination.findOne({
                _id: booking.idDestination,
            });

            const transaction = await Transaction.findOne({
                idBooking,
            });

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
                <p>ID Transaksi: ${booking._id}</p>
                <p>Destinasi: ${destination.name}</p>
                <p>Pembeli: ${booking.name}</p>
                <p>Tanggal: ${booking.date}</p>
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
                message: "get booking email success, please check email",
            });
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
