const stripHtml = require("string-strip-html");

exports.truncateText = (text = '', len = 30, dotted = '...') => {
    const stripText = stripHtml(text).result;
    console.log('stripText', stripText);
    const trimText = stripText.trim();
    return text.length > len ? (trimText.substr(0, len) + dotted) : trimText;
};
