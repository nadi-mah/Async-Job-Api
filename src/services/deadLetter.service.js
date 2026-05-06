const { v4: uuidv4 } = require('uuid')

const {createDeadLetterJob} = require('../repositories/deadLetter.repository');

const handleCreateDeadJob = async (jobId, ownerId, attempts, db) => {
    const newDeadJob = {
        id: uuidv4(),
        jobId,
        ownerId,
        reason: 'nothing',
        attempts,
        failedAt: new Date()
    }
    const result = await createDeadLetterJob(db, newDeadJob);
    if(!result){
        console.log('failed to create dead job');
    }
}

module.exports = {
    handleCreateDeadJob
}