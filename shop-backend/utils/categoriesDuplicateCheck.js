const Categories = require('../models/Categories');

const categoryDuplicateCheck = async (name = undefined, display_order = undefined) => {

    if (name !== undefined) {

        const duplicate_name = await Categories.checkCategoryExists(name);

        if (duplicate_name.length > 0) {
            return "This category name already exists";
        }
    }

    if (display_order !== undefined) {

        const duplicate_display_order = await Categories.checkDisplayOrderExists(display_order);
        
        if (duplicate_display_order !== undefined) {
            return "This display order is already taken";
        }
    }

    return "Duplicates are not found";
};

module.exports = categoryDuplicateCheck;