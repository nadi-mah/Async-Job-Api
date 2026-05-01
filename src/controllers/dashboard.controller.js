const {handleGetDashboard} = require('../services/dashboard.service');

const {StatusCodes} = require('http-status-codes');

const getDashboard = async(req, res) => {
    try {
        const {userId} = req.user;

        const result = await handleGetDashboard(userId);

        res.status(StatusCodes.OK).json(result);
        
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }

}

module.exports = {
    getDashboard
}