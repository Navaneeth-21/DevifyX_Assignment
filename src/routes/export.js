// src/routes/export.js
const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { verifyToken } = require('../middlewares/auth');
const rateLimiter = require('../middlewares/rateLimiter');

router.post('/request', verifyToken, rateLimiter, exportController.requestExport);

router.get('/download/:requestId', verifyToken, exportController.downloadExport);

module.exports = router;