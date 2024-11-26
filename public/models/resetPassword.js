"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    accessToken: String,
    expiresIn: Date
}, { timestamps: true });
exports.ResetPassword = (0, mongoose_1.model)('ResetPassword', schema);
