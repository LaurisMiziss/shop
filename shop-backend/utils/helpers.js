const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Sessions = require('../models/Sessions');

// Sessions
/**
 * Generate random session token
 * @returns {string} - Generated token
 */
const generateSessionToken = () => crypto.randomBytes(32).toString('hex');

/**
 * Generate date when token will expire
 * @returns {date} - Date when token will expire
 */
const expiresAt = () => {
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 2);
    return expires_at;
};

/**
 * @param {string} - Session token
 * @returns {string} - Hashed token
 */
const hashSessionToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

};

/**
 * Check if token is expired
 * @param {date} expires_at - Date when token will expire
 * @returns {true|false} - Returns true, if expires_at is lesser than current date
 */
const isExpired = (expires_at) => {
  const expired = new Date(expires_at) < new Date();
  return expired;
};

/**
 * Deletes session token
 * @param {string} token - Session token
 * @param {number} token - User ID
 */
const deleteToken = async (user_id, token) => await Sessions.deleteSession(user_id, token);

/**
 * Gets token then returns user and when token expires_at who has this token or undefined, 
 * if token doesn't attached to any user
 * @param {string} token - Session token
 * @param {number} token - User ID
 * @returns {Promise<object|null>} - User object or null
 */
const getSessionByHashedToken = async (user_id, token_hash) => {
  const user = await Sessions.getSessionByHashedToken(user_id, token_hash);
  return user;
};

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
};

/**
 * Compare plain text password with stored hash
 * @param {string} password - Plain text password
 * @param {string} hash - Stored hash from database
 * @returns {Promise<boolean>} - True if passwords match
 */
async function verifyPassword(password, hash) {
  const is_valid = await bcrypt.compare(password, hash);
  return is_valid;
};

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
  hashSessionToken,
  isExpired,
  deleteToken,
  getSessionByHashedToken,
  hashPassword,
  verifyPassword,
  validatePassword
}