"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
require("dotenv/config");
require("./infrastructure/logger");
const dataSources_1 = require("./dataSources");
const middlewares_1 = require("./middlewares");
const routes_1 = require("./routes");
const i18n_1 = require("./i18n");
dataSources_1.mongoose.run();
dataSources_1.redis.run();
const app = (0, express_1.default)();
app.use((0, path_1.join)('/', process.env.STORAGE_PATH), express_1.default.static((0, path_1.join)(__dirname, process.env.STORAGE_PATH)));
app.use(express_1.default.json({ limit: '10mb' }), express_1.default.urlencoded({ limit: '10mb', extended: true }), middlewares_1.corsMiddleware, i18n_1.i18nextHttpMiddleware.handle(i18n_1.i18next), middlewares_1.authMiddleware, routes_1.router, middlewares_1.notFoundMiddleware);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
