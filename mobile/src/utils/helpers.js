// Format date for display
export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

// Format date for birthday (without year)
export const formatBirthday = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

// Calculate age from birthday
export const calculateAge = (birthday) => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Calculate days until birthday
export const daysUntilBirthday = (birthday) => {
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

// Check if birthday is today
export const isBirthdayToday = (birthday) => {
  const today = new Date();
  const birthDate = new Date(birthday);
  return birthDate.getMonth() === today.getMonth() && 
         birthDate.getDate() === today.getDate();
};

// Check if birthday is upcoming within days
export const isUpcomingBirthday = (birthday, days = 7) => {
  const daysUntil = daysUntilBirthday(birthday);
  return daysUntil <= days && daysUntil >= 0;
};

// Generate random color for birthday cards
export const generateRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number format
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
  return phoneRegex.test(phone);
};

// Get greeting based on time of day
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
};

// Format notification time
export const formatNotificationTime = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')} ${d.getDate()}/${d.getMonth() + 1}`;
};

export default {
  formatDate,
  formatBirthday,
  calculateAge,
  daysUntilBirthday,
  isBirthdayToday,
  isUpcomingBirthday,
  generateRandomColor,
  validateEmail,
  validatePhone,
  getGreeting,
  formatNotificationTime
};