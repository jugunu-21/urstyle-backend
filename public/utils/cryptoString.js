"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCryptoString = void 0;
const crypto_1 = require("crypto");
const createCryptoString = ({ length = 48 } = {}) => (0, crypto_1.randomBytes)(length).toString('hex');
exports.createCryptoString = createCryptoString;
