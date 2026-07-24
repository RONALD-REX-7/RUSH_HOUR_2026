const Joi = require('joi');
const { USER_ROLES, CATEGORIES } = require('../config/constants');

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(...Object.values(USER_ROLES)).optional(),
  phone: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const reportSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().valid(...CATEGORIES).required(),
  coordinates: Joi.array().items(Joi.number()).length(2).required()
});

const opportunitySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required()
});

const milestoneSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  targetDate: Joi.date().optional()
});

const queueJoinSchema = Joi.object({
  applicationNote: Joi.string().optional()
});

module.exports = { registerSchema, loginSchema, reportSchema, opportunitySchema, milestoneSchema, queueJoinSchema };
