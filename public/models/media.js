"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
    orderColumn: {
        type: Number,
        default: 0
    },
    refType: String,
    refId: { type: mongoose_1.Schema.Types.ObjectId }
}, { timestamps: true });
exports.Media = (0, mongoose_1.model)('Media', schema);
