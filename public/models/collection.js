"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    collectionCategory: [{
            type: String,
            required: true
        }],
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Ids: [{
            type: String,
            required: true
        }],
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Like' }],
    dislikes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Dislike' }]
}, { timestamps: true });
schema.plugin(mongoose_paginate_v2_1.default);
exports.Collection = (0, mongoose_1.model)('Collection', schema);
