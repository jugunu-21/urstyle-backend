"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const http_status_codes_1 = require("http-status-codes");
const winston_1 = __importDefault(require("winston"));
const mongoose_1 = require("mongoose");
const image_1 = require("../infrastructure/image");
const services_1 = require("../services");
const cloudinary_1 = require("../utils/cloudinary");
exports.productController = {
    productUpload: async (req, res) => {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const { user } = req.context;
            const { name, price, subCategory, category, description, link, image, webLink } = req.body;
            const files = req.files;
            if (files['0']) {
                const file = files['0'];
                (0, cloudinary_1.uploadCloudinary)(file.path)
                    .then((async (response) => {
                    if (response !== undefined) {
                        await services_1.productService.create({
                            name,
                            price,
                            subCategory,
                            category,
                            image_url: response,
                            description,
                            link,
                            webLink,
                            userId: user.id,
                        });
                        new image_1.Image(file).deleteFile();
                        return response;
                    }
                }));
            }
            else {
                await services_1.productService.create({
                    name,
                    webLink,
                    price,
                    subCategory,
                    category,
                    image_url: image,
                    description,
                    link,
                    userId: user.id
                });
            }
            await session.commitTransaction();
            session.endSession();
            const response = res.status(http_status_codes_1.StatusCodes.OK).json({
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            });
            return response;
        }
        catch (error) {
            winston_1.default.error(error);
            if (session.inTransaction()) {
                await session.abortTransaction();
                session.endSession();
            }
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    },
    productFetch: async (req, res) => {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 6;
            const { user } = req.context;
            const id = user.id;
            const product = await services_1.productService.getProductsByUserForPagination(id, session, limit, page);
            const simplifiedProducts = product.docs.map(product => ({
                image: product.image_url,
                id: product.id,
                category: product.category,
                name: product.name,
                subCategory: product.subCategory,
                price: product.price,
                link: product.link,
                webLink: product.webLink,
                review: product.review,
                description: product.description
            }));
            await session.abortTransaction();
            session.endSession();
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                data: { simplifiedProducts, totalDocs: product.totalDocs },
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            });
        }
        catch (error) {
            if (session.inTransaction()) {
                await session.abortTransaction();
                session.endSession();
            }
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    },
    productFetchById: async (req, res) => {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const productId = req.params.productId;
            const product = await services_1.productService.getByIdWithString(productId);
            const simplifiedProducts = {
                image: product?.image_url,
                id: product?.id,
                webLink: product?.webLink,
                category: product?.category,
                name: product?.name,
                subCategory: product?.subCategory,
                price: product?.price,
                link: product?.link,
                review: product?.review,
                description: product?.description
            };
            console.log("simplifiedProducts", simplifiedProducts);
            await session.abortTransaction();
            session.endSession();
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                data: { simplifiedProducts },
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            });
        }
        catch (error) {
            if (session.inTransaction()) {
                await session.abortTransaction();
                session.endSession();
            }
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    },
    productUpdate: async (req, res) => {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const { name, price, subCategory, description, link, webLink, category, image } = req.body;
            const productId = req.params.id;
            const files = req.files;
            if (files['0']) {
                const file = files['0'];
                (0, cloudinary_1.uploadCloudinary)(file.path)
                    .then((async (response) => {
                    if (response !== undefined) {
                        ;
                        await services_1.productService.updateProductByProductId(productId, { response, name, price, description, link, subCategory, category, webLink, image_url: response });
                        new image_1.Image(file).deleteFile();
                        return response;
                    }
                }));
            }
            else {
                await services_1.productService.updateProductByProductId(productId, { name, price, description, link, subCategory, webLink, category, image_url: image });
            }
            console.log("Product is updated successfully");
            await session.commitTransaction();
            session.endSession();
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                data: "product updated",
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            });
        }
        catch (error) {
            console.log('Error updating product:', error);
            winston_1.default.error(error);
            if (session.inTransaction()) {
                await session.abortTransaction();
                session.endSession();
            }
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    },
    productDelete: async (req, res) => {
        const session = await (0, mongoose_1.startSession)();
        try {
            const productId = req.params.productId;
            if (!productId) {
                return res.status(401).json({ message: 'Unauthorized', status: http_status_codes_1.StatusCodes.BAD_REQUEST });
            }
            console.log("idcgghbjh", productId);
            await services_1.collectionService.checkProductsInCollectionsByProductId({ productId: productId, session: session });
            await services_1.productService.deleteByProductId(productId, session);
            session.endSession();
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            });
        }
        catch (error) {
            console.log('Error while deleting the  product:', error);
            winston_1.default.error(error);
            if (session.inTransaction()) {
                await session.abortTransaction();
                session.endSession();
            }
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    }
};
