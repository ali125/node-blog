"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueSlug = exports.slugify = exports.truncateText = void 0;
const { stripHtml } = require("string-strip-html");
const { Op } = require("sequelize");
const truncateText = (text = '', len = 10, dotted = '...') => {
    const stripText = stripHtml(text).result;
    const trimText = stripText.trim();
    return text.length > len ? (trimText.substr(0, len) + dotted) : trimText;
};
exports.truncateText = truncateText;
const slugify = (text) => {
    return text
        .replace(/\s+/g, '-') // Replace spaces with -
        // .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};
exports.slugify = slugify;
const getUniqueSlug = async (Model, title = null, slug_val = null, id = null) => {
    if (title || slug_val) {
        const slug = (slug_val ? (0, exports.slugify)(slug_val) : (0, exports.slugify)(title || '')).toLowerCase();
        const slug_result = await Model.findAll({
            where: {
                id: {
                    [Op.not]: id,
                },
                slug: {
                    [Op.like]: `${slug}`
                }
            },
            paranoid: false
        });
        return slug_result.length > 0 ? await (0, exports.getUniqueSlug)(Model, title, slug + Date.now().toString().substr(0, 3), id) : slug;
    }
    return '';
};
exports.getUniqueSlug = getUniqueSlug;
