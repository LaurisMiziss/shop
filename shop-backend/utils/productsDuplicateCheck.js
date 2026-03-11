const Products = require('../models/Products');

const productsDuplicateCheck = async (name = undefined) => {

    const duplicate_name = await Products.checkNameIsTaken(name);

    if (duplicate_name.length > 0) {
        return "This product name is already taken";
    }

    return "Duplicates are not found";
};

module.exports = productsDuplicateCheck;