const { JOB_TYPES } = require('../constants/job.constant');

const processJobByType = async (job) => {
  if (job.type === JOB_TYPES.EMAIL) {
    return processEmailJob(job);
  }

  if (job.type === JOB_TYPES.REPORT) {
    return processReportJob(job);
  }

  if (job.type === JOB_TYPES.PAYMENT_CHECK) {
    return processPaymentCheckJob(job);
  }

  if (job.type === JOB_TYPES.IMAGE_PROCESSING) {
    return processImageProcessingJob(job);
  }

  throw new Error('unknown job type');
};

const processEmailJob = async (job) => {
  const success = Math.random() < 0.9;

  if (!success) {
    throw new Error('email sending failed');
  }

  return {
    message: 'email sent successfully',
    to: job.payload.to,
    subject: job.payload.subject,
    processedAt: new Date()
  };
};

const processReportJob = async (job) => {
  const success = Math.random() < 0.7;

  if (!success) {
    throw new Error('report generation failed');
  }

  return {
    message: 'report generated successfully',
    reportName: job.payload.reportName,
    processedAt: new Date()
  };
};

const processPaymentCheckJob = async (job) => {
  const success = Math.random() < 0.5;

  if (!success) {
    throw new Error('payment check failed');
  }

  return {
    message: 'payment checked successfully',
    paymentId: job.payload.paymentId,
    processedAt: new Date()
  };
};

const processImageProcessingJob = async (job) => {
  const success = Math.random() < 0.6;

  if (!success) {
    throw new Error('image processing failed');
  }

  return {
    message: 'image processed successfully',
    imageUrl: job.payload.imageUrl,
    processedAt: new Date()
  };
};

module.exports = {
  processJobByType
};