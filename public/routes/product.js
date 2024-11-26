"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.product = void 0;
const guards_1 = require("../guards");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const product = (router) => {
    router.post('/product/upload', guards_1.authGuard.isAuth, middlewares_1.ImageMiddleware, controllers_1.productController.productUpload);
    router.post('/product/fetch', guards_1.authGuard.isAuth, controllers_1.productController.productFetch);
    router.post('/product/update/:id', guards_1.authGuard.isAuth, middlewares_1.ImageMiddleware, controllers_1.productController.productUpdate);
    router.delete('/product/delete/:productId', guards_1.authGuard.isAuth, controllers_1.productController.productDelete);
    router.post('/product/fetch/:productId', controllers_1.productController.productFetchById);
};
exports.product = product;
