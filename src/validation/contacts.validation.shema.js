import Joi from 'joi';

export const createContactsSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least 3 characters',
    'string.max': 'Username should have at most 30 characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).pattern(/^\+380\s?\(?\d{2}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/).messages({
    'number.base': 'Phone Number should be a number',
    'number.min': 'Phone Number should have at least 10 characters',
    'number.max': 'Phone Number should have at most 13 characters',
    'any.required': 'PhoneNumber is required',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.base': 'Email should be a string',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'IsFavourite should be as true or false',
  }),
  contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal').required().messages({
    'stringr.base': 'ContactType should be as work/home/personal string',
    'any.required': 'ContactType is required',
  }),
});


export const updateContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least 3 characters',
    'string.max': 'Username should have at most 30 characters',
  }),
 phoneNumber: Joi.string().min(3).max(20).pattern(/^\+380\d{9}$/).messages({
    'number.base': 'Phone Number should be a number',
    'number.min': 'Phone Number should have at least 10 characters',
    'number.max': 'Phone Number should have at most 13 characters',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.base': 'Email should be a string',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'IsFavourite should be as true or false',
  }),
  contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal').messages({
    'stringr.base': 'ContactType should be as work/home/personal string',
  }),
});

