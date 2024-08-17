"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    phone_number: String,
    verified: {
        type: Boolean,
        default: false
    },
    verifications: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Verification' }],
    resetPasswords: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'ResetPassword' }]
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', schema);
