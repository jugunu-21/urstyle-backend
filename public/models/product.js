"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    pid: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    review: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'review'
        }
    ],
    description: String,
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
exports.Product = (0, mongoose_1.model)('Product', schema);
