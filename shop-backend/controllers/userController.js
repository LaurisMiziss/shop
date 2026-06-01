const Users = require('../models/Users');
const Sessions = require('../models/Sessions');
const helpers = require('../utils/helpers');
const asyncHandler = require('../utils/asyncHandler');
const pool = require('../config/db');
const usersDuplicateCheck = require('../utils/usersDuplicateCheck');
const validateEmailFormat = require('../utils/validateEmailFormat');
const userQueryFilter = require('../utils/userQueryFilter');

// User registration
const register = asyncHandler (async (req, res) => {

    const { 
        username, email, password, full_name, phone, address_line1, 
        address_line2, city, postal_code, country 
    } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            info: "Invalid input"
        });
    }

    if (username.length < 6) {
        return res.status(400).json({
            success: false,
            info: "Invalid username"
        });
    }

    if (!helpers.validatePassword(password)) {
        return res.status(400).json({
            success: false,
            info: "Invalid password"
        });
    }

    if (!validateEmailFormat(email)) {
        return res.status(400).json({
            success: false,
            info: "Invalid e-mail"
        });
    }

    const message = await usersDuplicateCheck(username, email, phone);

    if (message !== "Duplicates are not found") {
        return res.status(400).json({
            success: false,
            info: message
        });

    } else {
        const password_hash = await helpers.hashPassword(password);

        await Users.createUser(
            username, email, password_hash, full_name, phone, address_line1,
            address_line2, city, postal_code, country 
        );

        res.status(201).json({
            success: true,
            info: 'New user was successfully created'
        });
    }

});

// User login
const login = asyncHandler (async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            info: "Invalid input"
        });
    }

    const user = await Users.validateEmail(email);

    if (!user) {
        return res.status(401).json({
            success: false,
            info: 'Incorrect e-mail or password.'
        });
    }

    const verified = await helpers.verifyPassword(password, user.password_hash);

    if (!verified) {
        return res.status(401).json({
            success: false,
            info: 'Incorrect e-mail or password.'
        });
    }

    const token = helpers.generateSessionToken();

    const token_with_user_id = `${user.id}.${token}`;

    const expires_at = helpers.expiresAt();

    const hashed_token = helpers.hashSessionToken(token);

    await Sessions.createSession(user.id, hashed_token, expires_at);
    await Users.patchLastLogin(user.id, new Date());
    
    const { password_hash, ...userWithoutPasswordHash } = user;

    res.status(200).json({
        success: true,
        data: userWithoutPasswordHash,
        token: token_with_user_id,
        info: "Access granted"
    });

});

const loginByToken = asyncHandler (async (req, res) => {
    
    const token = req.headers.authorization;
    const user_id = req.user.id;

    if (!user_id || !token) {
        return res.status(404).json({
            success: false,
            info: "Invalid session token"
        });
    }

    const user = await Users.getUser(user_id);

    if (!user) {
        return res.status(400).json({
            success: false,
            info: "User with such ID is not found"
        });
    }

    const { password_hash, ...userWithoutPasswordHash } = user;

    res.status(200).json({
        success: true,
        data: userWithoutPasswordHash,
        token: token,
        info: "User with such token was found"
    });
    
});

// Validate name, email or phone
const validateField = asyncHandler (async (req, res) => {

    const { value, field } = req.query;

    const user_id = req.user.id ? req.user.id : null;

    const message = await usersDuplicateCheck(value, field, user_id);

    if (message !== "Duplicates are not found") {
        return res.status(409).json({
            success: false,
            info: message
        });
    } else {
        return res.status(200).json({
            success: true,
            info: message
        });
    }

});

const getUserSettings = asyncHandler (async (req, res) => {
    
    const user_id = +req.user.id;

    const data = await Users.getUserSettings(user_id);

    res.status(200).json({
        success: true,
        info: "User's settings was successfully retrieved",
        data: data
    });

});

// Asking user to enter password before changing personal information, deleting account
const verifyAction = asyncHandler (async (req, res) => {

    const user_id = +req.user.id;
    const password = req.body.password;

    const user = await Users.getUser(user_id);

    if (!user) {
        return res.status(404).json({
            success: false,
            info: "User with such ID is not found"
        });
    }

    const matches = await helpers.verifyPassword(password, user.password_hash);

    if (!matches) {
        return res.status(400).json({
            success: false,
            info: "Invalid password"
        });
    } else {
        return res.status(200).json({
            success: true,
            info: "Access granted"
        });
    }

});

// Available user's patch fields: username, email, full_name, phone, address_line1, 
// address_line2, city, postal_code, country, password
const patchUserField = asyncHandler (async (req, res) => {

    const user_id = +req.user.id;
    const { 
        username, email, full_name, phone, address_line1, 
        address_line2, city, postal_code, country, password
    } = req.body;

    const user = await Users.getUser(user_id);

    if (user === undefined) {
        return res.status(404).json({
            success: false,
            info: "User with such ID is not found"
        });
    }

    if (username !== user.username) {
        if (username.length < 6 || await Users.validateUsername(username)) {
            return res.status(400).json({
                success: false,
                info: "Invalid username"
            });
        }

        await Users.patchUsername(user_id, username);
    }

    if (email !== user.email) {
        if (!validateEmailFormat(email) || await Users.validateEmail(email)) {
            return res.status(400).json({
                success: false,
                info: "Invalid e-mail"
            });
        }

        await Users.patchEmail(user_id, email);
    }

    if (full_name !== user.full_name) {
        await Users.patchFullName(user_id, full_name);
    }

    if (phone !== user.phone) {
        if (await Users.validatePhone(phone)) {
            return res.status(409).json({
                success: false,
                info: "This phone is already taken"
            });
        }

        await Users.patchPhone(user_id, phone);
    }

    if (address_line1 !== user.address_line1) {
        await Users.patchAddressLine1(user_id, address_line1);
    }

    if (address_line2 !== user.address_line2) {
        await Users.patchAddressLine2(user_id, address_line2)
    }

    if (city !== user.city) {
        await Users.patchCity(user_id, city)
    }

    if (postal_code !== user.postal_code) {
        await Users.patchPostalCode(user_id, postal_code)
    }

    if (country !== user.country) {
        await Users.patchCountry(user_id, country)
    }

    if (password !== undefined) {
        if (!helpers.validatePassword(password)) {
            return res.status(400).json({
                success: false,
                info: "Invalid password"
            });
        }

        const user = await Users.getUser(user_id);

        if (user === undefined) {
            return res.status(404).json({
                success: false,
                info: "User with such ID is not found"
            });
        }

        const matches = await helpers.verifyPassword(password, user.password_hash);

        if (matches) {
            return res.status(400).json({
                success: false,
                info: "New password is exactly the same as a previous one"
            });
        }

        const password_hash = await helpers.hashPassword(password);
        
        await Users.patchPasswordHash(user_id, password_hash);
    }

    const new_user = await Users.getUser(user_id);

    const { password_hash, user_without_password } = new_user;

    res.status(200).json({
        success: true,
        data: user_without_password,
        info: "User's information was updated"
    });

});

// Patch user's settings, available fields: language, theme
const patchSetting = asyncHandler (async (req, res) => {

    const user_id = +req.user.id;

    const { language, theme } = req.body;
    
    if (language) {
        const allowedOptions = ["EN", "LV"];

        if (!allowedOptions.includes(language)) return res.status(404).json({
            success: false,
            info: "This language setting is not available"
        });

        await Users.patchLanguage(user_id, language);
    }

    if (theme) {
        const allowedOptions = ["DARK", "LIGHT"];

        if (!allowedOptions.includes(theme)) return res.status(404).json({
            success: false,
            info: "This theme setting is not available"
        });

        await Users.patchTheme(user_id, theme);
    }

    res.status(200).json({
        success: true,
        info: "User's settings was updated"
    });

});

// Patch user's password
const patchPassword = asyncHandler (async(req, res) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const user_id = +req.user.id;

        const { oldPassword, newPassword } = req.body;

        const user = await Users.getUser(user_id);

        const matches = await helpers.verifyPassword(oldPassword, user.password_hash);

        if (!matches) {
            return res.status(400).json({
                success: false,
                info: "Invalid password"
            });
        }

        if ((newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) || (oldPassword === newPassword)) {
            return res.status(400).json({
                success: false,
                info: "New password has a wrong format or is exactly the same as the old password"
            });
        }

        const password_hash = await helpers.hashPassword(newPassword);

        await Users.patchPasswordHash(user_id, password_hash);

        await client.query("COMMIT");

        res.status(200).json({
            success: true,
            info: "User's password was successfully updated"
        });

    } catch (err) {

        await client.query("ROLLBACK");
        throw err;

    } finally {

        client.release();

    }
});

// Delete user
const deleteUser = asyncHandler (async (req, res) => {

    const user_id = +req.user.id;

    const { password } = req.body;

    if (!password) {
        return res.status(404).json({
            success: false,
            info: "Password is missing"
        });
    }

    const user = await Users.getUser(user_id);

    if (user === undefined) {
        return res.status(404).json({
            success: false,
            info: "User with such ID is not found"
        });
    }

    const result = await helpers.verifyPassword(password, user.password_hash);

    if (!result) {
        return res.status(404).json({
            success: false,
            info: "Wrong password was provided"
        });
    }

    await Users.deleteUser(user_id);
    
    res.status(200).json({
        success: true,
        info: "User was deleted"
    });

});

// Admin role required to use below controllers
// Get detailed information about a user
const getUser = asyncHandler ( async (req, res) => {

    const user = req.user;
    const user_id = +req.params.user_id || undefined;

    if (!Number.isInteger(user_id)) {
        return res.status(400).json({
            success: false,
            info: "Invalid user_id"
        });
    }

    const retrievedUser = await Users.getUser(user_id);

    if (!retrievedUser) {
        return res.status(404).json({
            success: false,
            info: "User with such ID is not found"
        });
    }
    
    const { password_hash, ...userWithoutPasswordHash } = retrievedUser;

    res.status(200).json({
        success: true,
        data: userWithoutPasswordHash,
        info: "User was successfully retrieved"
    });

});

// Get all users
const getAllUsers = asyncHandler ( async (req, res) => {

    const user = req.user;
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const user_id = +req.query.user_id || undefined;

    if (!Number.isInteger(offset) || !Number.isInteger(limit) || (user_id && !Number.isInteger(user_id))) {
        return res.status(400).json({
            success: false,
            info: "Invalid offset, limit or user_id"
        });
    }

    const query = userQueryFilter(user.role === "admin", limit, offset, user_id);

    if (query === "Error") {
        return res.status(400).json({
            success: false,
            info: "Not allowed"
        });
    }

    const users = await Users.getAllUsers(query, limit, offset);

    res.status(200).json({ 
        success: true, 
        data: users, 
        info: "Retrieved users" 
    });

});

// Patch user's role
const patchRole = asyncHandler (async (req, res) => {

    const target_user_id = +req.params.target_user_id;
    const role = req.body.role;
    
    const roles = ["customer", "admin"];

    if (!roles.includes(role)) {
        return res.status(400).json({
            success: false,
            info: "Invalid role"
        });
    }

    if (req.user.id === target_user_id) {
        return res.status(400).json({
            info: "Admin cannot change their own role"
        });
    }

    const target_user = await Users.getUser(target_user_id);

    if (target_user === undefined) {
        return res.status(404).json({
            success: false,
            info: "User with such ID is not found"
        });
    }

    await Users.patchRole(target_user_id, role);

    res.status(200).json({
        success: true,
        info: "User's role was updated"
    });

});

module.exports = {
    register,
    login,
    loginByToken,
    validateField,
    getUserSettings,
    verifyAction,
    patchUserField,
    patchSetting,
    patchPassword,
    deleteUser,
    getUser,
    getAllUsers,
    patchRole
};