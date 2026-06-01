const Users = require('../models/Users');

const usersDuplicateCheck = async (value, field, user_id) => {
    
    if (field === "username") {
        const found_acc = await Users.validateUsername(value);

        const message = "This username is already taken";

        if (!user_id && found_acc) return message;

        if (found_acc && found_acc.id !== user_id) {
            return message;
        }
    } else if (field === "email") {
        const found_acc = await Users.validateEmail(value);

        const message = "This e-mail is already taken";

        if (!user_id && found_acc) return message;

        if (found_acc && found_acc.id !== user_id) {
            return message;
        }
    } else {
        const found_acc = await Users.validatePhone(value);

        const message = "This phone is already taken";

        if (!user_id && found_acc) return message;

        if (found_acc && found_acc.id !== user_id) {
            return message;
        }
    }

    return "Duplicates are not found";
};

module.exports = usersDuplicateCheck;