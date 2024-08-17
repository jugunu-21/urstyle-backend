"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const models_1 = require("../models");
const console_1 = require("console");
const cloudinary_1 = require("../utils/cloudinary");
exports.productService = {
    create: ({ pid, name, code, link, image_url, price, review, description, userId, verified = false }, session) => new models_1.Product({
        pid,
        name,
        code,
        link,
        image_url,
        price,
        review,
        description,
        userId,
        verified
    }).save({ session }),
    getById: (userId) => models_1.Product.findById(userId),
    updateProductByProductId: async (productId, { name, price, description, code, link, pid, image_url }, session) => {
        try {
            const product = await models_1.Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            await (0, cloudinary_1.deleteFromCloudinaryWithUrl)(product.image_url);
            const data = [{ _id: productId }, { name, price, description, link, code, pid, image_url }];
            let params = null;
            if (session) {
                params = [...data, { session }];
            }
            else {
                params = data;
            }
            return models_1.Product.updateMany(...params);
        }
        catch {
            console_1.error;
        }
        console.error('Error updating product:', console_1.error);
        throw console_1.error;
    },
    getproductsbyuser: async (userId, session) => {
        try {
            const products = await models_1.Product.find({ userId }).session(session);
            return products;
        }
        catch (error) {
            console.error('Error fetching products by user:', error);
            throw error;
        }
    },
    deleteById: async (userId, session) => {
        try {
            const product = await models_1.Product.findById(userId);
            if (!product) {
                throw new Error('Product not found');
            }
            await (0, cloudinary_1.deleteFromCloudinaryWithUrl)(product.image_url);
            return models_1.Product.deleteOne({ user: userId }, { session });
        }
        catch {
            console_1.error;
        }
        console.error("doesnot exist any product with this id ");
        throw console_1.error;
    }
};
