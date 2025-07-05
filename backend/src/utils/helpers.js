const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Format date for display
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

// Format date for birthday (without year)
const formatBirthday = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

// Check if birthday is upcoming within reminder days
const isUpcomingBirthday = (birthday, reminderDays) => {
  const today = new Date();
  const birthDate = new Date(birthday);
  
  // Set current year for comparison
  const currentYear = today.getFullYear();
  const nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  
  // If birthday has passed this year, check next year
  if (nextBirthday < today) {
    nextBirthday.setFullYear(currentYear + 1);
  }
  
  // Calculate days until birthday
  const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
  
  return daysUntilBirthday <= reminderDays && daysUntilBirthday >= 0;
};

// Calculate days until birthday
const daysUntilBirthday = (birthday) => {
  const today = new Date();
  const birthDate = new Date(birthday);
  
  // Set current year for comparison
  const currentYear = today.getFullYear();
  const nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  
  // If birthday has passed this year, check next year
  if (nextBirthday < today) {
    nextBirthday.setFullYear(currentYear + 1);
  }
  
  return Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
};

// Calculate age from birthday
const calculateAge = (birthday) => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Generate random color for birthday cards
const generateRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

module.exports = {
  generateToken,
  formatDate,
  formatBirthday,
  isUpcomingBirthday,
  daysUntilBirthday,
  calculateAge,
  generateRandomColor
};