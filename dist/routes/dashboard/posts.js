"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const validations_1 = require("../../middleware/validations");
const postController = __importStar(require("../../controllers/dashboard/post"));
const config_1 = require("../../config");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: config_1.imageDirectory });
router.get('/', postController.all);
router.get('/create', postController.create);
router.post('/create', upload.single('image'), validations_1.postValidation, postController.save);
router.get('/:postId/edit', postController.edit);
router.post('/:postId/edit', upload.single('image'), validations_1.postValidation, postController.update);
router.delete('/:postId', postController.destroy);
exports.default = router;
