const { stripHtml } = require("string-strip-html");
const { Op } = require("sequelize");

export const truncateText = (text = '', len = 10, dotted = '...') => {
    const stripText = stripHtml(text).result;
    const trimText = stripText.trim();
    return text.length > len ? (trimText.substr(0, len) + dotted) : trimText;
};

export const slugify = (text: string) => {
    return text
        .replace(/\s+/g, '-')           // Replace spaces with -
        // .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

type UniqueSlug = (Model: any, title?: string | null, slug_val?: string | null, id?: number | null) => Promise<string>;

export const getUniqueSlug: UniqueSlug = async (Model, title = null, slug_val = null, id = null) => {
    if(title || slug_val) {
        const slug = (slug_val ? slugify(slug_val) : slugify(title || '')).toLowerCase();
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
        return slug_result.length > 0 ? await getUniqueSlug(Model, title, slug + Date.now().toString().substr(0, 3), id) : slug;
    }
    return '';
};