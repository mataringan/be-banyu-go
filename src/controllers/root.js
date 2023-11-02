exports.handleRoot = async (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: "API is running!",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
