import API from './api';

export const BirthdayService = {
  // Get all birthdays
  getBirthdays: async (token) => {
    try {
      const response = await API.getBirthdays(token);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to get birthdays',
        error 
      };
    }
  },

  // Get single birthday
  getBirthday: async (id, token) => {
    try {
      const response = await API.getBirthday(id, token);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to get birthday',
        error 
      };
    }
  },

  // Create new birthday
  createBirthday: async (birthdayData, token) => {
    try {
      const response = await API.createBirthday(birthdayData, token);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to create birthday',
        error 
      };
    }
  },

  // Update birthday
  updateBirthday: async (id, birthdayData, token) => {
    try {
      const response = await API.updateBirthday(id, birthdayData, token);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to update birthday',
        error 
      };
    }
  },

  // Delete birthday
  deleteBirthday: async (id, token) => {
    try {
      await API.deleteBirthday(id, token);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to delete birthday',
        error 
      };
    }
  },

  // Get upcoming birthdays
  getUpcomingBirthdays: async (token, days = 7) => {
    try {
      const response = await API.getBirthdays(token);
      const birthdays = response.data;
      
      // Filter upcoming birthdays
      const today = new Date();
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + days);
      
      const upcomingBirthdays = birthdays.filter(birthday => {
        const birthDate = new Date(birthday.birthday);
        const currentYear = today.getFullYear();
        const nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
        
        // If birthday has passed this year, check next year
        if (nextBirthday < today) {
          nextBirthday.setFullYear(currentYear + 1);
        }
        
        return nextBirthday >= today && nextBirthday <= targetDate;
      });
      
      return { success: true, data: upcomingBirthdays };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to get upcoming birthdays',
        error 
      };
    }
  },

  // Get today's birthdays
  getTodaysBirthdays: async (token) => {
    try {
      const response = await API.getBirthdays(token);
      const birthdays = response.data;
      
      // Filter today's birthdays
      const today = new Date();
      const todaysBirthdays = birthdays.filter(birthday => {
        const birthDate = new Date(birthday.birthday);
        return birthDate.getMonth() === today.getMonth() && 
               birthDate.getDate() === today.getDate();
      });
      
      return { success: true, data: todaysBirthdays };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to get today\'s birthdays',
        error 
      };
    }
  },

  // Search birthdays
  searchBirthdays: async (query, token) => {
    try {
      const response = await API.getBirthdays(token);
      const birthdays = response.data;
      
      // Filter birthdays based on search query
      const filteredBirthdays = birthdays.filter(birthday =>
        birthday.name.toLowerCase().includes(query.toLowerCase()) ||
        birthday.email?.toLowerCase().includes(query.toLowerCase()) ||
        birthday.phone?.includes(query) ||
        birthday.notes?.toLowerCase().includes(query.toLowerCase())
      );
      
      return { success: true, data: filteredBirthdays };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to search birthdays',
        error 
      };
    }
  },

  // Validate birthday data
  validateBirthdayData: (data) => {
    const errors = {};
    
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Name is required';
    }
    
    if (!data.birthday) {
      errors.birthday = 'Birthday is required';
    } else {
      const birthDate = new Date(data.birthday);
      const today = new Date();
      if (birthDate > today) {
        errors.birthday = 'Birthday cannot be in the future';
      }
    }
    
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (data.phone && !/^[0-9+\-\s()]{10,15}$/.test(data.phone)) {
      errors.phone = 'Invalid phone number format';
    }
    
    if (data.reminderDays && (data.reminderDays < 0 || data.reminderDays > 365)) {
      errors.reminderDays = 'Reminder days must be between 0 and 365';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default BirthdayService;