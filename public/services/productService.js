"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const models_1 = require("../models");
const console_1 = require("console");
const cloudinary_1 = require("../utils/cloudinary");
exports.productService = {
    create: ({ category, name, subCategory, webLink, link, image_url, price, review, description, userId, verified = false }, session) => new models_1.Product({
        category,
        name,
        subCategory,
        link,
        image_url,
        price,
        review,
        webLink,
        description,
        userId,
        verified
    }).save({ session }),
    getById: (productId) => models_1.Product.findById(productId),
    getByIdHavingSomeFields: ({ productId }) => models_1.Product.findById(productId).select({
        image_url: 1,
        id: 1,
        category: 1,
        name: 1,
        subCategory: 1,
        price: 1,
        webLink: 1,
        link: 1,
        review: 1,
        description: 1
    }),
    getByIdWithString: async (productId) => await models_1.Product.findById(productId),
    getProductByProductId: async (productId) => await models_1.Product.findById(productId),
    updateProductByProductId: async (productId, { name, price, description, subCategory, webLink, link, category, image_url, response }, session) => {
        try {
            const product = await models_1.Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            if (response) {
                await (0, cloudinary_1.deleteFromCloudinaryWithUrl)(product.image_url);
            }
            const data = [{ _id: productId }, { webLink, name, price, description, link, subCategory, category, image_url }];
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
    getProductsByUser: async (userId, session) => {
        try {
            const products = await models_1.Product.find({ userId }).session(session);
            return products;
        }
        catch (error) {
            console.error('Error fetching products by user:', error);
            throw error;
        }
    },
    getProductsByUserForPagination: async (userId, session, limit, page) => {
        return models_1.Product.paginate({ userId }, { page, limit, session })
            .then((result) => {
            return result;
        })
            .catch((err) => {
            throw err;
        });
    },
    deleteByProductId: async (productId, session) => {
        try {
            const product = await models_1.Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            await (0, cloudinary_1.deleteFromCloudinaryWithUrl)(product.image_url);
            return models_1.Product.deleteOne({ _id: productId }, { session });
        }
        catch {
            console_1.error;
        }
        console.error("doesnot exist any product with this id ");
        throw console_1.error;
    }
};
