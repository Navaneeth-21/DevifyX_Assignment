const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');

router.get('/exports', auth.verifyToken, auth.isAdmin, adminController.getExportRequests);

module.exports = router;