const Bull = require('bull');
const logger = require('../utils/logger');

const exportQueue = new Bull('export-queue', process.env.REDIS_URL, {
  defaultJobOptions: {
    attempts: 3, 
    backoff: { type: 'exponential', delay: 1000 }, // Exponential backoff
  },
});

exportQueue.on('error', (error) => {
  logger.error('Queue error', { error });
});

exportQueue.on('failed', (job, error) => {
  logger.error('Job failed', { jobId: job.id, error });
});

module.exports = exportQueue;