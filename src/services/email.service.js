require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking Partner" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = `Welcome to Banking Partner`;
  const text = `Hello ${name},\n\nThank you for registering at Banking Partner, we're excited to have you on board!\n\nBest regards,\nThe Banking Partner Team`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering at Banking Partner. We're excited to have you on board!</p><p>Best regards,<br>The Banking Partner Team</p>`;
  await sendEmail(userEmail, subject, text, html);
}

async function loginEmail(userEmail, name) {
  const subject = `Login Alert`;
  const text = `Hello ${name},\n\nYou have been successfully logged in to Banking Partner.\n\nIf you think you didn't log in, please contact the admin to change your password.\n\nBest regards,\nThe Banking Partner Team`;
  const html = `<p>Hello ${name},</p><p>You have been successfully logged in to Banking Partner!</p><p>Best regards,<br>The Banking Partner Team</p>`;
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, type, transactionId){
  const subject = `Transaction Alert: Account ${type === 'CREDIT' ? 'Credited' : 'Debited'}`;
  const actionText = type === 'CREDIT' ? 'credited to' : 'debited from';
  const text = `Hello ${name},\n\nAn amount of ${amount} has been ${actionText} your Banking Partner account (Transaction ID: ${transactionId}).\n\nIf you did not authorize this, please contact our support immediately.\n\nBest regards,\nThe Banking Partner Team`;
  const html = `<p>Hello ${name},</p><p>An amount of <strong>${amount}</strong> has been <strong>${actionText}</strong> your Banking Partner account (Transaction ID: ${transactionId}).</p><p>If you did not authorize this, please contact our support immediately.</p><p>Best regards,<br>The Banking Partner Team</p>`;
  await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendRegistrationEmail, loginEmail, sendTransactionEmail };