// src/controllers/exportController.js
const ExportRequest = require('../models/ExportRequest');
const exportProcessor = require('../services/exportProcessor');
const logger = require('../utils/logger');
const constants = require('../utils/constants');

exports.requestExport = async (req, res) => {
  const { excludedCategories = [] } = req.body;
  const userId = req.user.userId;

  try {
    // Validate excluded categories
    const invalidCategories = excludedCategories.filter(
      (cat) => !constants.DATA_CATEGORIES.includes(cat)
    );
    if (invalidCategories.length > 0) {
      logger.error('Invalid categories', { userId, invalidCategories });
      return res.status(400).json({ error: 'Invalid data categories' });
    }

    const exportRequest = new ExportRequest({
      userId,
      excludedCategories,
    });
    await exportRequest.save();

    exportProcessor.addToQueue(exportRequest._id);

    logger.info('Export request created', { userId, requestId: exportRequest._id });
    res.status(201).json({
      message: 'Export request submitted',
      requestId: exportRequest._id,
    });
  } catch (error) {
    logger.error('Export request error', { error: error.message, userId });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.downloadExport = async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user.userId;

  try {
    const exportRequest = await ExportRequest.findById(requestId);
    if (!exportRequest || exportRequest.userId.toString() !== userId) {
      logger.error('Unauthorized download attempt', { userId, requestId });
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    if (exportRequest.status !== constants.EXPORT_STATUSES.COMPLETED) {
      logger.error('Export not ready', { userId, requestId, status: exportRequest.status });
      return res.status(400).json({ error: 'Export not ready' });
    }

    res.download(exportRequest.downloadLink, `export-${requestId}.zip`, (err) => {
      if (err) {
        logger.error('Download error', { error: err.message, userId, requestId });
        res.status(500).json({ error: 'Download failed' });
      } else {
        logger.info('Export downloaded', { userId, requestId });
      }
    });
  } catch (error) {
    logger.error('Download request error', { error: error.message, userId, requestId });
    res.status(500).json({ error: 'Server error' });
  }
};