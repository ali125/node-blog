"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_1 = __importDefault(require("./posts"));
const categories_1 = __importDefault(require("./categories"));
const tags_1 = __importDefault(require("./tags"));
const settings_1 = __importDefault(require("./settings"));
const users_1 = __importDefault(require("./users"));
const comments_1 = __importDefault(require("./comments"));
const router = (0, express_1.Router)();
/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('dashboard', { title: 'News and Stories' });
});
router.use('/posts', posts_1.default);
router.use('/categories', categories_1.default);
router.use('/tags', tags_1.default);
router.use('/users', users_1.default);
router.use('/comments', comments_1.default);
router.use('/settings', settings_1.default);
exports.default = router;
