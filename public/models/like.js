"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
const mongoose_1 = require("mongoose");
const LikeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    collectionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Collection' },
});
exports.Like = (0, mongoose_1.model)('Like', LikeSchema);
