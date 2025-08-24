const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
// Import Brevo SDK
const brevo = require('@getbrevo/brevo');

// Biến để kiểm tra xem Firebase đã được khởi tạo chưa
let firebaseInitialized = false;

// Initialize Firebase Admin SDK
try {
  // Bỏ qua việc khởi tạo Firebase để tránh lỗi
  console.log('Bỏ qua việc khởi tạo Firebase để tránh lỗi');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Initialize email transporter for nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Initialize Brevo API instance
let apiInstance = null;
try {
  // Khởi tạo API instance
  apiInstance = new brevo.TransactionalEmailsApi();
  console.log('Brevo API initialized successfully');
} catch (error) {
  console.error('Brevo API initialization error:', error);
}

// Send push notification
const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  try {
    if (!fcmToken) {
      console.log('No FCM token provided, skipping push notification');
      return;
    }

    if (!firebaseInitialized) {
      console.warn('Firebase not initialized, cannot send push notification');
      return;
    }

    const message = {
      notification: {
        title,
        body
      },
      data,
      token: fcmToken
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent push notification:', response);
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};

// Send email notification using Nodemailer
const sendEmailNotification = async (to, subject, html) => {
  try {
    if (!to) {
      console.log('No email address provided, skipping email notification');
      return;
    }

    const mailOptions = {
      from: `Birthday Reminder <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent via Nodemailer:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email via Nodemailer:', error);
    throw error;
  }
};

// Send email notification using Brevo API
const sendBrevoEmailNotification = async (to, subject, html) => {
  try {
    if (!to) {
      console.log('No email address provided, skipping email notification');
      return;
    }

    // Nếu Brevo API không được khởi tạo, sử dụng Nodemailer
    if (!apiInstance) {
      console.warn('Brevo API not initialized, falling back to Nodemailer');
      return await sendEmailNotification(to, subject, html);
    }

    try {
      // Tạo email
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = html;
      sendSmtpEmail.sender = { email: process.env.BREVO_EMAIL, name: 'Birthday Reminder' };
      sendSmtpEmail.to = [{ email: to }];
      
      // Thiết lập API key
      if (apiInstance.authentications && apiInstance.authentications['api-key']) {
        apiInstance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
      } else {
        throw new Error('API authentication not available');
      }
      
      // Gửi email
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email sent via Brevo:', data);
      return data;
    } catch (error) {
      console.error('Error with Brevo API, falling back to Nodemailer:', error);
      return await sendEmailNotification(to, subject, html);
    }
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    // Fallback to Nodemailer
    console.log('Falling back to Nodemailer...');
    return await sendEmailNotification(to, subject, html);
  }
};

module.exports = {
  sendPushNotification,
  sendEmailNotification,
  sendBrevoEmailNotification
}; 