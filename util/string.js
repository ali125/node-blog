const stripHtml = require("string-strip-html");

exports.truncateText = (text = '', len = 30, dotted = '...') => {
    const stripText = stripHtml(text).result;
    const trimText = stripText.trim();
    return len && text.length > len ? (trimText.substr(0, len) + dotted) : trimText;
};

exports.formatDate = date => {
    return `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
};
