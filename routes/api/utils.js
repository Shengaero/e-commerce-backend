// fuck you
const mapTag = (tag, extraBullshit = null) => {
    const { id, tag_name } = tag;
    const mappedTag = { id, tag_name };

    if(extraBullshit) {
        for(let key in extraBullshit) {
            mappedTag[key] = extraBullshit[key];
        }
    }

    return mappedTag;
};

// fuck you
const mapCategory = (category, extraBullshit = null) => {
    const { id, category_name } = category;
    const mappedCategory = { id, category_name };

    if(extraBullshit) {
        for(let key in extraBullshit) {
            mappedCategory[key] = extraBullshit[key];
        }
    }

    return mappedCategory;
};

// fuck you
const mapProduct = (product, extraBullshit = null) => {
    const { id, product_name, price, stock, category_id } = product;
    const mappedProduct = { id, product_name, price, stock, category_id };

    if(extraBullshit) {
        for(let key in extraBullshit) {
            mappedProduct[key] = extraBullshit[key];
        }
    }

    return mappedProduct;
};

module.exports = {
    mapTag,
    mapCategory,
    mapProduct
};
