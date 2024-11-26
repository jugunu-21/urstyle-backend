"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const schema = new mongoose_1.Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    webLink: {
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
schema.plugin(mongoose_paginate_v2_1.default);
exports.Product = (0, mongoose_1.model)('Product', schema);
