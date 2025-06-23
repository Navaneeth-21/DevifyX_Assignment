const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = {
  sendExportReadyEmail: async (email, requestId) => {
    try {
      logger.info('Attempting to send export email', { email, requestId });
      const info = await transporter.sendMail({
        from: '21951a05b4@iare.ac.in',
        to: email,
        subject: 'Your Data Export is Ready',
        text: `Download your data: ${process.env.APP_URL}/export/download/${requestId}`,
      });
      logger.info('Export email sent', { email, requestId, messageId: info.messageId });
    } catch (error) {
      logger.error('Email sending error', {
        error: {
          message: error.message,
          code: error.code,
          stack: error.stack,
        },
        email,
        requestId,
      });
      throw error;
    }
  },
};