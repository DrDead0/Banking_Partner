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

async function sendRegistrationEmail(userEmail,name){
    const subject = `Welcome to Banking Partner`
    const text = `Hello ${name}, \n\n Thank you for Registering at the Banking partner,
    we're excited to have you on board.! \n\n Best, Regards,\n The Banking Partner Team `
    const html = `<p>Hello ${name},\n\n </p><p>Thank you for registering at the Banking
    Partner. we're excited to have you on board.!</P><p>Best Regards,<br> The Banking Partner Team`
    await sendEmail(userEmail, subject, text, html)
}
module.exports = {sendRegistrationEmail};