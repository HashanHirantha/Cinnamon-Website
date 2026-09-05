import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'pure_gold_cinnamon_jwt_secret_key_2025_ceylon_secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || 'pure_gold_cinnamon_admin_jwt_secret_key_2025_secure';
const JWT_ADMIN_EXPIRES_IN = process.env.JWT_ADMIN_EXPIRES_IN || '12h';

export const generateCustomerToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyCustomerToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const generateAdminToken = (payload) => {
  return jwt.sign(payload, JWT_ADMIN_SECRET, { expiresIn: JWT_ADMIN_EXPIRES_IN });
};

export const verifyAdminToken = (token) => {
  return jwt.verify(token, JWT_ADMIN_SECRET);
};
