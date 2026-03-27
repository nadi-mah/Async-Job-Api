const {handleCreateJob, handleGetJob, handleGetAllJobs} = require('../services/job.service');
const {handleGetAllJobEvents} = require('../services/jobEvent.service');

const {StatusCodes} = require('http-status-codes');

const createJob = async(req, res) => {
    try {
        const {userId} = req.user;

        const result = await handleCreateJob(userId);
        return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }

}

const getJob = async(req, res) => {
    try {
        const {userId} = req.user;
        const {id} = req.params;

        const result = await handleGetJob(userId, id);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }

}

const getAllJobs = async(req, res) => {
    try {
        const {userId} = req.user;
        
        const result = await handleGetAllJobs(userId);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    }
}

const getAllJobEvents = async (req, res) => {
    try {
        const {userId} = req.user;
        const {id} = req.params;
        
        const result = await handleGetAllJobEvents(userId, id);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "something went wrong!"
        })
    } 
}

module.exports = {
    createJob,
    getJob,
    getAllJobs,
    getAllJobEvents
}