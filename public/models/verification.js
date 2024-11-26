"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verification = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    accessToken: String,
    expiresIn: Date
}, { timestamps: true });
exports.Verification = (0, mongoose_1.model)('Verification', schema);
