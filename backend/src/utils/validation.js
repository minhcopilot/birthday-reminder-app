const Joi = require('joi');

const validateRegistration = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
  });

  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    fcmToken: Joi.string().allow(null, '')
  });

  return schema.validate(data);
};

const validateBirthday = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    birthday: Joi.date().required(),
    email: Joi.string().email().allow(null, ''),
    phone: Joi.string().allow(null, ''),
    reminderDays: Joi.number().integer().min(0).default(1),
    notes: Joi.string().allow(null, '')
  });

  return schema.validate(data);
};

const validateUserUpdate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    currentPassword: Joi.string().when('password', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    reminderTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/),
    fcmToken: Joi.string().allow(null, '')
  });

  return schema.validate(data);
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateBirthday,
  validateUserUpdate
}; 