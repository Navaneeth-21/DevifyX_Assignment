// src/services/exportProcessor.js
const exportQueue = require('../config/queue');
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');
const ExportRequest = require('../models/ExportRequest');
const dataAggregation = require('./dataAggregation');
const fileService = require('./fileService');
const emailService = require('./emailService');
const logger = require('../utils/logger');

exports.addToQueue = (requestId) => {
  exportQueue.add({ requestId });
};

exportQueue.process(async (job) => {
  const { requestId } = job.data;
  try {
    const exportRequest = await ExportRequest.findById(requestId);
    if (!exportRequest) throw new Error('Export request not found');

    exportRequest.status = 'processing';
    await exportRequest.save();

    const userData = await dataAggregation.aggregateUserData(
      exportRequest.userId,
      exportRequest.excludedCategories
    );

    const outputPath = path.join(__dirname, `../../exports/export-${requestId}.zip`);
    await fileService.createArchive(userData, outputPath);

    exportRequest.status = 'completed';
    exportRequest.downloadLink = outputPath;
    exportRequest.completedAt = new Date();
    await exportRequest.save();

    await emailService.sendExportReadyEmail(exportRequest.userId, requestId);
    logger.info('Export processed', { requestId });
  } catch (error) {
    exportRequest.status = 'failed';
    await exportRequest.save();
    logger.error('Export processing error', { error, requestId });
  }
});