const User = require('./User');
const Birthday = require('./Birthday');
const Notification = require('./Notification');

// Define associations
User.hasMany(Birthday, { foreignKey: 'userId', as: 'birthdays' });
Birthday.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Birthday.hasMany(Notification, { foreignKey: 'birthdayId', as: 'notifications' });
Notification.belongsTo(Birthday, { foreignKey: 'birthdayId', as: 'birthday' });

module.exports = {
  User,
  Birthday,
  Notification
};