"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pairing = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    look: String,
    desc: String,
    expected_delivery: String,
    cart: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'product'
        }],
    overall_description: String
}, {});
exports.Pairing = (0, mongoose_1.model)('Pairing', schema);
