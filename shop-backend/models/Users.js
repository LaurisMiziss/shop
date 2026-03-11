const pool = require('../config/db');

const getUser = async (user_id) => {
    const result = await pool.query(
        `SELECT * FROM users
        WHERE id = $1;`,
        [user_id]
    );

    return result.rows[0];
};

const validateUsername = async (username) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE username = $1;`,
        [username]
    );

    return result.rows[0];
};

const validateEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1;`,
        [email]
    );

    return result.rows[0];
};

const validatePhone = async (phone) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE phone = $1;`,
        [phone]
    );

    return result.rows[0];
};

const createUser = async (
    username, email, password_hash, full_name = null, phone = null, address_line1 = null,
    address_line2 = null, city = null, postal_code = null, country = null
) => {
    await pool.query(
        `INSERT INTO users (username, email, password_hash, full_name, phone, address_line1,
        address_line2, city, postal_code, country) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
        [username, email, password_hash, full_name, phone, address_line1,
        address_line2, city, postal_code, country]
    );
};

const patchUsername = async (user_id, username) => {
    await pool.query(
        `UPDATE users SET username = $2
        WHERE id = $1;`,
        [user_id, username]
    );
};

const patchEmail = async (user_id, email) => {
    await pool.query(
        `UPDATE users SET email = $2
        WHERE id = $1;`,
        [user_id, email]
    );
};

const patchPasswordHash = async (user_id, password_hash) => {
    await pool.query(
        `UPDATE users SET password_hash = $2
        WHERE id = $1;`,
        [user_id, password_hash]
    );
};

const patchRole = async (user_id, role) => {
    await pool.query(
        `UPDATE users SET role = $2
        WHERE id = $1;`,
        [user_id, role]
    );
};

const patchFullName= async (user_id, full_name) => {
    await pool.query(
        `UPDATE users SET full_name = $2
        WHERE id = $1;`,
        [user_id, full_name]
    );
};

const patchPhone = async (user_id, phone) => {
    await pool.query(
        `UPDATE users SET phone = $2
        WHERE id = $1;`,
        [user_id, phone]
    );
};

const patchAddressLine1 = async (user_id, address_line1) => {
    await pool.query(
        `UPDATE users SET address_line1 = $2
        WHERE id = $1;`,
        [user_id, address_line1]
    );
};

const patchAddressLine2 = async (user_id, address_line2) => {
    await pool.query(
        `UPDATE users SET address_line2 = $2
        WHERE id = $1;`,
        [user_id, address_line2]
    );
};

const patchCity = async (user_id, city) => {
    await pool.query(
        `UPDATE users SET city = $2
        WHERE id = $1;`,
        [user_id, city]
    );
};

const patchPostalCode = async (user_id, postal_code) => {
    await pool.query(
        `UPDATE users SET postal_code = $2
        WHERE id = $1;`,
        [user_id, postal_code]
    );
};

const patchCountry = async (user_id, country) => {
    await pool.query(
        `UPDATE users SET country = $2
        WHERE id = $1;`,
        [user_id, country]
    );
};

const patchLastLogin = async (user_id, last_login) => {
    await pool.query(
        `UPDATE users SET last_login = $2
        WHERE id = $1;`,
        [user_id, last_login]
    );
};

const deleteUser = async (user_id) => {
    await pool.query(
        `DELETE FROM users
        WHERE id = $1;`,
        [user_id]
    );
};

module.exports = {
    getUser,
    validateUsername,
    validateEmail,
    validatePhone,
    createUser,
    patchUsername,
    patchEmail,
    patchPasswordHash,
    patchRole,
    patchFullName,
    patchPhone,
    patchAddressLine1,
    patchAddressLine2,
    patchCity,
    patchPostalCode,
    patchCountry,
    patchLastLogin,
    deleteUser
};