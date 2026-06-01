const Categories = require('../models/Categories');

const categoryDuplicateCheck = async (name = undefined, display_order = undefined, category_id = undefined) => {

    if (name) {

        const category = await Categories.checkCategoryExists(name);

        if (category) {
            if (category.id !== category_id) return "This category name already exists";
        }
    }

    if (display_order) {

        const category = await Categories.checkDisplayOrderExists(display_order);

        if (category) {
            if (category.id !== category_id) return "This display order is already taken";
        }
    }

    return "Duplicates are not found";
};

module.exports = categoryDuplicateCheck;