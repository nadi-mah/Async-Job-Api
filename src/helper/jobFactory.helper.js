const { JOB_TYPES } = require('../constants/job.constant');

const createRandomJobInput = () => {
    const randomNumber = Math.random();

    if (randomNumber < 0.25) {
        return {
            type: JOB_TYPES.EMAIL,
            payload: {
                to: 'test@example.com',
                subject: 'Welcome email'
            }
        };
    }

    if (randomNumber < 0.5) {
        return {
            type: JOB_TYPES.REPORT,
            payload: {
                reportName: 'daily_summary'
            }
        };
    }

    if (randomNumber < 0.75) {
        return {
            type: JOB_TYPES.PAYMENT_CHECK,
            payload: {
                paymentId: `payment-${Date.now()}`
            }
        };
    }

    return {
        type: JOB_TYPES.IMAGE_PROCESSING,
        payload: {
            imageUrl: 'https://example.com/image.jpg'
        }
    };
};

module.exports = {
    createRandomJobInput
};