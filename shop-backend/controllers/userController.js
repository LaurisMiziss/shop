const Users = require('../models/Users');
const Sessions = require('../models/Sessions');
const helpers = require('../utils/helpers');
const asyncHandler = require('../utils/asyncHandler');
const usersDuplicateCheck = require('../utils/usersDuplicateCheck');
const validateEmailFormat = require('../utils/validateEmailFormat');

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

// Validate name, email or phone
const validateField =  asyncHandler (async (req, res) => {

    const { username, email, phone } = req.query;

    const message = await usersDuplicateCheck(username, email, phone);

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

// Delete user
const deleteUser = asyncHandler (async (req, res) => {

    const user_id = +req.user.id;


    const user = await Users.getUser(user_id);

    if (user === undefined) {
        return res.status(404).json({
            success: false,
            info: "User with such ID is not found"
        });
    }

    await Users.deleteUser(user_id);

    res.status(200).json({
        success: true,
        info: "User was deleted"
    });

});

// Admin role required to use below controllers
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
    validateField,
    verifyAction,
    patchUserField,
    deleteUser,
    patchRole
};