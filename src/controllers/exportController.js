const ExportRequest = require('../models/ExportRequest');
const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');
const exportProcessor = require('../services/exportProcessor');

exports.requestExport = async (req, res) => {
  const { excludedCategories } = req.body; // For data redaction
    try {
      const exportRequest = new ExportRequest({
        userId: req.user.userId,
        excludedCategories: excludedCategories || [],
      });
      await exportRequest.save();
      await new AuditLog({
        userId: req.user.userId,
        action: 'export_request',
        details: { requestId: exportRequest._id },
      }).save();
      exportProcessor.addToQueue(exportRequest._id);
      logger.info('Export request created', { userId: req.user.userId, requestId: exportRequest._id });
      res.status(201).json({ message: 'Export request submitted', requestId: exportRequest._id });
    } catch (error) {
      logger.error('Export request error', { error });
      res.status(500).json({ error: 'Server error' });
    }
};

exports.downloadExport = async (req, res) => {
  const { requestId } = req.params;
  try {
    const exportRequest = await ExportRequest.findById(requestId);
    if (!exportRequest || exportRequest.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    if (exportRequest.status !== 'completed') {
      return res.status(400).json({ error: 'Export not ready' });
    }
    await new AuditLog({
      userId: req.user.userId,
      action: 'export_download',
      details: { requestId },
    }).save();
    res.download(exportRequest.downloadLink);
    logger.info('Export downloaded', { userId: req.user.userId, requestId });
  } catch (error) {
    logger.error('Download error', { error });
    res.status(500).json({ error: 'Server error' });
  }
};