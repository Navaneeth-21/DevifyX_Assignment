const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authRoutes = require('./routes/auth');
const exportRoutes = require('./routes/export');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRoutes);
app.use('/export', exportRoutes);
app.use('/admin', adminRoutes);
app.use(errorHandler);

connectDB(); // Initialize MongoDB connection

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));