"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_1 = require("./auth");
const users_1 = require("./users");
const product_1 = require("./product");
const media_1 = require("./media");
const collection_1 = require("./collection");
const router = (0, express_1.Router)();
exports.router = router;
const routes = { auth: auth_1.auth, users: users_1.users, product: product_1.product, collection: collection_1.collection, media: media_1.media };
for (const route in routes) {
    routes[route](router);
}
