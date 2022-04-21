const stripHtml = require("string-strip-html");
const { Op } = require("sequelize");

const truncateText = (text = '', len = 10, dotted = '...') => {
    const stripText = stripHtml(text);
    const trimText = stripText.trim();
    return text.length > len ? (trimText.substr(0, len) + dotted) : trimText;
};

const slugify = (text) => {
    return text
        .replace(/\s+/g, '-')           // Replace spaces with -
        // .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

const getUniqueSlug = async (Model, title = null, slug_val = null, id = null) => {
    if(title || slug_val) {
        const slug = slug_val ? slugify(slug_val) : slugify(title);
        const slug_result = await Model.findAll({
            where: {
                id: {
                    [Op.not]: id,
                },
                slug: {
                    [Op.like]: `%${slug}%`
                }
            }
        });
        return slug_result.length > 0 ? slug + slug_result.length : slug;
    }
    return '';
};

module.exports = {
    truncateText,
    stripHtml,
    slugify,
    getUniqueSlug
};
