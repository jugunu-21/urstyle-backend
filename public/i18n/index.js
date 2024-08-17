"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18nextHttpMiddleware = exports.i18next = void 0;
const i18next_1 = __importDefault(require("i18next"));
exports.i18next = i18next_1.default;
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
exports.i18nextHttpMiddleware = i18next_http_middleware_1.default;
const en_json_1 = __importDefault(require("./translations/en.json"));
const ka_json_1 = __importDefault(require("./translations/ka.json"));
i18next_1.default.use(i18next_http_middleware_1.default.LanguageDetector).init({
    detection: {
        order: ['header'],
        lookupHeader: 'accept-language'
    },
    preload: ['en', 'ka'],
    fallbackLng: 'en',
    resources: {
        en: { translation: en_json_1.default },
        ka: { translation: ka_json_1.default }
    }
});
