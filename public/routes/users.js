"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const guards_1 = require("../guards");
const controllers_1 = require("../controllers");
const validations_1 = require("../validations");
const users = (router) => {
    router.get('/me', guards_1.authGuard.isAuth, controllers_1.userController.me);
    router.post('/user/delete', guards_1.authGuard.isAuth, validations_1.userValidation.deleteProfile, controllers_1.userController.deleteProfile);
};
exports.users = users;
