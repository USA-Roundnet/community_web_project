const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using SMTP transport
// This is a development configuration using Ethereal
let transporter = null;

async function createTransporter() {
  if (transporter) {
    return transporter;
  }

  // If we're in development mode, create a test account
  if (process.env.NODE_ENV !== 'production') {
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    return transporter;
  }

  // For production, use actual email credentials from environment variables
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  return transporter;
}

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 * @returns {Promise<object>} - Nodemailer send mail response
 */
async function sendEmail(to, subject, html) {
  const emailTransporter = await createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Rally Point" <noreply@rallypoint.com>',
    to,
    subject,
    html
  };

  const info = await emailTransporter.sendMail(mailOptions);
  
  // For development, log the URL where the email preview can be viewed
  if (process.env.NODE_ENV !== 'production') {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
}

module.exports = {
  sendEmail
};
