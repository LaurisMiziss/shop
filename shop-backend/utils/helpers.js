const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Sessions = require('../models/Sessions');

// Sessions
/**
 * Generate random session token
 */
const generateSessionToken = () => crypto.randomBytes(32).toString('hex');

/**
 * Generate date when token will expire
 * @returns {date} - Date when token will expire
 */
const expiresAt = () => {
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 2);
    return expiresAt;
}

/**
 * Check if token is expired
 * @param {date} expires_at - Date when token will expire
 * @returns {true|false} - Returns true, if expires_at is lesser than current date
 */
const isExpired = (expires_at) => {
  const expired = new Date(expires_at) < new Date();
  return expired;
}

/**
 * Deletes session token
 * @param {string} token - Session token
 */
const deleteToken = async (token) => await Sessions.deleteSession(token);

/**
 * Gets token then returns user and when token expires_at who has this token or undefined, 
 * if token doesn't attached to any user
 * @param {string} token - Session token
 * @returns {Promise<object|null>} - User object or null
 */
const getSessionByToken = async (token) => {
  const user = await Sessions.getSessionByToken(token);
  return user;
}

// Auth
// Number of salt rounds (higher = more secure but slower)
// 10 is standard, 12 is very secure
const SALT_ROUNDS = 10;

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return hash;
}

/**
 * Compare plain text password with stored hash
 * @param {string} password - Plain text password
 * @param {string} hash - Stored hash from database
 * @returns {Promise<boolean>} - True if passwords match
 */
async function verifyPassword(password, hash) {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}

/**
 * 
 * @param {string} password - Plain text password
 * @returns {<boolean>} - False if password is less then 8 symbols, don't have at least one upper-letter and number
 */
const validatePassword = (password) => {
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return false;
  } else {
    return true;
  };
};

module.exports = {
  generateSessionToken,
  expiresAt,
  isExpired,
  deleteToken,
  getSessionByToken,
  hashPassword,
  verifyPassword,
  validatePassword
}