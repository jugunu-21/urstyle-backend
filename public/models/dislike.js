"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dislike = void 0;
const mongoose_1 = require("mongoose");
const DislikeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    collectionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Collection' },
});
exports.Dislike = (0, mongoose_1.model)('Dislike', DislikeSchema);
