const Products = require('../models/Products');

const productsDuplicateCheck = async (name = undefined, product_id) => {
    if (!product_id) return "Product ID is required";

    const product = await Products.checkNameIsTaken(name);

    if (product.length !== 0) {
        if ((product[0].name === name & product_id !== product[0].id)) return "This product name is already taken";
    }

    return "Duplicates are not found";
};

module.exports = productsDuplicateCheck;