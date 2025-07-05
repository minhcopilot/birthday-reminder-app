const cron = require('node-cron');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const Birthday = require('../models/Birthday');
const User = require('../models/User');
const { sendPushNotification, sendEmailNotification } = require('./notificationService');

// Function to get upcoming birthdays for notifications
const getUpcomingBirthdays = async () => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    
    // Find all active birthdays and their users
    const birthdays = await Birthday.findAll({
      where: { isActive: true },
      include: [{
        model: User,
        attributes: ['id', 'email', 'firstName', 'lastName', 'fcmToken', 'reminderTime'],
        where: { isActive: true }
      }]
    });
    
    const upcomingBirthdays = birthdays.filter(birthday => {
      const birthDate = new Date(birthday.birthday);
      const birthMonth = birthDate.getMonth() + 1;
      const birthDay = birthDate.getDate();
      
      // Calculate days until birthday
      let daysUntil;
      if (birthMonth > currentMonth || (birthMonth === currentMonth && birthDay > currentDay)) {
        // Birthday is later this year
        const thisYearBirthday = new Date(today.getFullYear(), birthMonth - 1, birthDay);
        daysUntil = Math.floor((thisYearBirthday - today) / (1000 * 60 * 60 * 24));
      } else {
        // Birthday is next year
        const nextYearBirthday = new Date(today.getFullYear() + 1, birthMonth - 1, birthDay);
        daysUntil = Math.floor((nextYearBirthday - today) / (1000 * 60 * 60 * 24));
      }
      
      // Check if we should send a reminder based on reminderDays
      return daysUntil === birthday.reminderDays;
    });
    
    return upcomingBirthdays;
  } catch (error) {
    console.error('Error getting upcoming birthdays:', error);
    return [];
  }
};

// Function to send birthday reminders
const sendBirthdayReminders = async () => {
  try {
    const upcomingBirthdays = await getUpcomingBirthdays();
    
    for (const birthday of upcomingBirthdays) {
      const user = birthday.User;
      const birthDate = new Date(birthday.birthday);
      const birthMonth = birthDate.getMonth() + 1;
      const birthDay = birthDate.getDate();
      
      // Format date for display
      const formattedDate = `${birthDay}/${birthMonth}`;
      
      // Send push notification if FCM token exists
      if (user.fcmToken) {
        await sendPushNotification(
          user.fcmToken,
          `Nhắc nhở sinh nhật: ${birthday.name}`,
          `${birthday.name} sẽ có sinh nhật vào ngày ${formattedDate} (còn ${birthday.reminderDays} ngày nữa).`,
          {
            birthdayId: birthday.id.toString(),
            type: 'birthday_reminder'
          }
        );
      }
      
      // Send email notification to user
      await sendEmailNotification(
        user.email,
        `Nhắc nhở sinh nhật: ${birthday.name}`,
        `
        <h2>Nhắc nhở sinh nhật</h2>
        <p>Xin chào ${user.firstName},</p>
        <p><strong>${birthday.name}</strong> sẽ có sinh nhật vào ngày <strong>${formattedDate}</strong> (còn ${birthday.reminderDays} ngày nữa).</p>
        <p>Thông tin liên hệ:</p>
        <ul>
          ${birthday.email ? `<li>Email: ${birthday.email}</li>` : ''}
          ${birthday.phone ? `<li>Điện thoại: ${birthday.phone}</li>` : ''}
        </ul>
        ${birthday.notes ? `<p>Ghi chú: ${birthday.notes}</p>` : ''}
        <p>Đây là email tự động từ ứng dụng Birthday Reminder.</p>
        `
      );
      
      console.log(`Sent reminder for ${birthday.name}'s birthday to ${user.email}`);
    }
    
    console.log(`Processed ${upcomingBirthdays.length} birthday reminders`);
  } catch (error) {
    console.error('Error sending birthday reminders:', error);
  }
};

// Schedule daily check at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily birthday check...');
  await sendBirthdayReminders();
});

// Also export for manual testing
module.exports = {
  sendBirthdayReminders,
  getUpcomingBirthdays
}; 