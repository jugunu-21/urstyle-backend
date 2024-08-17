"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaController = void 0;
const http_status_codes_1 = require("http-status-codes");
const winston_1 = __importDefault(require("winston"));
const mongoose_1 = require("mongoose");
const services_1 = require("../services");
const image_1 = require("../infrastructure/image");
const paths_1 = require("../utils/paths");
const services_2 = require("../services");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("../utils/cloudinary");
exports.mediaController = {
    imageUpload: async ({ file }, res) => {
        try {
            const filepath = file?.path;
            if (filepath) {
                const path = (0, paths_1.joinRelativeToMainPath)(filepath);
                const fileBuffer = fs_1.default.readFileSync(path);
                const url = await (0, cloudinary_1.uploadFileToCloudinary)(fileBuffer);
                console.log("url", url);
                const media = await services_1.mediaService.create(file);
                console.log('media', media);
                await new image_1.Image(file).deleteFile();
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    data: { url: url },
                    message: http_status_codes_1.ReasonPhrases.OK,
                    status: http_status_codes_1.StatusCodes.OK
                });
            }
            await new image_1.Image(file).deleteFile();
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
        catch (error) {
            console.log("errorlast");
            winston_1.default.error(error);
            await new image_1.Image(file).deleteFile();
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    },
    productUpload: async (request, res) => {
        console.log("control");
        const { user } = request.context;
        const { name, price, code, pid, image, description, link } = request.body;
        const session = await (0, mongoose_1.startSession)();
        try {
            session.startTransaction();
            const product = await services_2.productService.create({
                name,
                price,
                code,
                pid,
                image_url: image,
                description,
                link,
                userId: user.id
            }, session);
            console.log("product saved in db", product);
            await session.commitTransaction();
            session.endSession();
            const tokendata = {
                id: product.id
            };
            const accessToken = jsonwebtoken_1.default.sign(tokendata, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
            const response = res.status(http_status_codes_1.StatusCodes.OK).json({
                data: accessToken,
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            });
            return response;
        }
        catch (error) {
            console.log(error);
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
        try {
            const session = await (0, mongoose_1.startSession)();
            const { user } = req.context;
            const id = user.id;
            const products = await services_2.productService.getproductsbyuser(id, session);
            const simplifiedProducts = products.map(product => ({
                image: product.image_url,
                id: product.id,
                pid: product.pid,
                name: product.name,
                code: product.code,
                price: product.price,
                link: product.link,
                review: product.review,
                description: product.description
            }));
            console.log("products", products);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                data: simplifiedProducts,
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            });
        }
        catch (error) {
        }
    },
    productUpdate: async (req, res) => {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const { name, price, code, description, link, pid, image } = req.body;
            const productId = req.params.id;
            await services_2.productService.updateProductByProductId(productId, { name, price, description, link, code, pid, image_url: image });
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
            const { user } = req.context;
            const id = req.params.id;
            if (!id) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            await services_2.productService.deleteById(id, session);
            session.endSession();
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: http_status_codes_1.ReasonPhrases.OK,
                Status: http_status_codes_1.StatusCodes.OK
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
