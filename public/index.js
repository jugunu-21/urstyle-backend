"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const multer_1 = __importDefault(require("multer"));
require("./infrastructure/logger");
const dataSources_1 = require("./dataSources");
const middlewares_1 = require("./middlewares");
const routes_1 = require("./routes");
const i18n_1 = require("./i18n");
dataSources_1.mongoose.run();
dataSources_1.redis.run();
const app = (0, express_1.default)();
const upload = (0, multer_1.default)();
app.use("/", (req, res) => {
    res.json({ message: "hello welcome" });
});
app.use(express_1.default.json({ limit: '10mb' }), express_1.default.urlencoded({ limit: '10mb', extended: true }), middlewares_1.corsMiddleware, i18n_1.i18nextHttpMiddleware.handle(i18n_1.i18next), middlewares_1.authMiddleware, routes_1.router, middlewares_1.notFoundMiddleware);
const port = process.env.APP_PORT || 443;
app.listen(port, () => console.log(`Server listening on port ${port}`));
