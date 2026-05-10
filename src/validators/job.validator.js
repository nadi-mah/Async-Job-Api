const { JOB_TYPES } = require('../constants/job.constant');

const validateCreateJobInput = ({ type, payload }) => {
  if (!type) {
    return 'job type is required';
  }

  if (!Object.values(JOB_TYPES).includes(type)) {
    return 'invalid job type';
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return 'payload must be an object';
  }

  if (type === JOB_TYPES.EMAIL) {
    if (!payload.to) {
      return 'email job requires "to"';
    }

    if (!payload.subject) {
      return 'email job requires "subject"';
    }
  }

  if (type === JOB_TYPES.REPORT) {
    if (!payload.reportName) {
      return 'report job requires "reportName"';
    }
  }

  if (type === JOB_TYPES.PAYMENT_CHECK) {
    if (!payload.paymentId) {
      return 'payment_check job requires "paymentId"';
    }
  }

  if (type === JOB_TYPES.IMAGE_PROCESSING) {
    if (!payload.imageUrl) {
      return 'image_processing job requires "imageUrl"';
    }
  }

  return null;
};

module.exports = {
  validateCreateJobInput
};