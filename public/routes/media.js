"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.media = void 0;
const guards_1 = require("../guards");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const media = (router) => {
    router.post('/media/image/upload', guards_1.authGuard.isAuth, middlewares_1.uploadSingleImageMiddleware, controllers_1.mediaController.imageUpload);
    router.post('/media/images/upload', guards_1.authGuard.isAuth, middlewares_1.ImageMiddleware, controllers_1.mediaController.imageUpload);
    router.post('/media/product/upload', guards_1.authGuard.isAuth, middlewares_1.ImageMiddleware, controllers_1.mediaController.productUpload);
    router.post('/media/product/fetch', guards_1.authGuard.isAuth, controllers_1.mediaController.productFetch);
    router.post('/media/product/update/:id', guards_1.authGuard.isAuth, middlewares_1.ImageMiddleware, controllers_1.mediaController.productUpdate);
    router.post('/media/product/delete/:id', guards_1.authGuard.isAuth, controllers_1.mediaController.productDelete);
};
exports.media = media;
