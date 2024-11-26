"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const multer_1 = __importDefault(require("multer"));
const controllers_1 = require("../controllers");
const guards_1 = require("../guards");
const validations_1 = require("../validations");
const upload = (0, multer_1.default)();
const auth = (router) => {
    router.post('/auth/sign-in', guards_1.authGuard.isGuest, validations_1.authValidation.signIn, controllers_1.authController.signIn);
    router.post('/auth/sign-up', guards_1.authGuard.isGuest, validations_1.authValidation.signUp, controllers_1.authController.signUp);
    router.get('/auth/sign-out', guards_1.authGuard.isAuth, controllers_1.authController.signOut);
};
exports.auth = auth;
