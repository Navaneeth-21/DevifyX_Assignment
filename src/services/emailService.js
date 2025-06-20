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

exports.sendExportReadyEmail = async (userId, requestId) => {
  try {
    const user = await User.findById(userId);
    await transporter.sendMail({
      from: 'no-reply@yourapp.com',
      to: user.email,
      subject: 'Your Data Export is Ready',
      text: `Your data export is ready. Download it here: ${process.env.APP_URL}/export/download/${requestId}`,
    });
    logger.info('Email sent', { userId, requestId });
  } catch (error) {
    logger.error('Email error', { error });
  }
};