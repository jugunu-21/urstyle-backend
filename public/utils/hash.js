"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHash = void 0;
const bcrypt_1 = require("bcrypt");
const createHash = (string) => (0, bcrypt_1.hash)(string, 10);
exports.createHash = createHash;
