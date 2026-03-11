const Users = require('../models/Users');

const usersDuplicateCheck = async (username = undefined, email = undefined, phone = undefined) => {
    
    if (username !== undefined) {

        const duplicate_username = await Users.validateUsername(username);

        if (duplicate_username !== undefined) {
            return "This username is already taken";
        }
    }

    if (email !== undefined) {

        const duplicate_email = await Users.validateEmail(email);

        if (duplicate_email !== undefined) {
            return "This e-mail is already taken";
        }
    }

    if (phone !== undefined) {
        
        const duplicate_phone = await Users.validatePhone(phone);

        if (duplicate_phone !== undefined) {
            return "This phone is already taken";
        }
    }

    return "Duplicates are not found";
};

module.exports = usersDuplicateCheck;