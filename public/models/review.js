"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    rname: String,
    data: String,
    content: String,
    rating: String
}, { timestamps: true });
exports.Review = (0, mongoose_1.model)('Review', schema);
