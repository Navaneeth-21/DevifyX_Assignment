const ExportRequest = require('../models/ExportRequest');
const logger = require('../utils/logger');

exports.getExportRequests = async (req, res) => {
  try {
    const requests = await ExportRequest.find()
      .populate('userId', 'email')
      .sort({ requestedAt: -1 });
    res.json(requests);
    logger.info('Admin viewed export requests');
  } catch (error) {
    logger.error('Admin export requests error', { error });
    res.status(500).json({ error: 'Server error' });
  }
};