"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionController = void 0;
const http_status_codes_1 = require("http-status-codes");
const winston_1 = __importDefault(require("winston"));
const mongoose_1 = require("mongoose");
const services_1 = require("../services");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.collectionController = {
    collectionUpload: async (req, res) => {
        console.log("collectionUpload");
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const { user } = req.context;
            console.log("input", user.id);
            const { name, description, Ids, collectionCategory } = req.body;
            console.log("input2", user.id);
            console.log("Ids", Ids);
            const collection = await services_1.collectionService.create({
                name,
                description,
                Ids,
                userId: user.id,
                collectionCategory
            }, session);
            console.log("collection", collection);
            await session.commitTransaction();
            session.endSession();
            const tokendata = {
                id: collection.id
            };
            const accessToken = jsonwebtoken_1.default.sign(tokendata, process.env.JWT_SECRET, {
                expiresIn: '48h'
            });
            const response = res.status(http_status_codes_1.StatusCodes.OK).json({
                data: accessToken,
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
    collectionFetch: async (req, res, next) => {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        const { user } = req.context;
        try {
            const catgeoryQuery = req.query.categoryQuery;
            const likedQuery = req.query.likedQuery;
            const LIKED = "likedCollection";
            if (likedQuery === LIKED) {
                return next();
            }
            let collections;
            if (!catgeoryQuery) {
                collections = await services_1.collectionService.getCollection(session);
            }
            else {
                collections = await services_1.collectionService.getCollectionByQuery(catgeoryQuery, session);
            }
            const transformedCollectionProducts = [];
            const TransfomedCollections = [];
            for (const collection of collections) {
                const transformedCollectionProductsNew = [];
                for (const id of collection.Ids) {
                    const product = await services_1.productService.getByIdWithString(id);
                    if (product) {
                        const simplifiedProduct = {
                            image: product.image_url,
                            id: product.id,
                            category: product.category,
                            name: product.name,
                            webLink: product.webLink,
                            subCategory: product.subCategory,
                            price: product.price,
                            link: product.link,
                            review: Array.isArray(product.review) ? product.review : [],
                            description: product.description
                        };
                        transformedCollectionProductsNew.push(simplifiedProduct);
                    }
                }
                const existsLike = user ? (await services_1.likeandUnlikeService.IslikeByUserIdCollectionIdExsist({
                    userId: user.id,
                    collectionId: collection?.id
                })) : null;
                const simplifiedCollection = {
                    name: collection.name,
                    description: collection.description,
                    products: transformedCollectionProductsNew,
                    collectionId: collection.id,
                    ...(existsLike != null && { likestatus: existsLike })
                };
                TransfomedCollections.push(simplifiedCollection);
            }
            await session.commitTransaction();
            session.endSession();
            const response = {
                data: TransfomedCollections,
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            };
            return res.status(http_status_codes_1.StatusCodes.OK).json(response);
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
    LikedCollectionFetch: async (req, res) => {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        const { user } = req.context;
        let collectionIds = [];
        if (user.likes) {
            const havecollectionsIds = await services_1.likeandUnlikeService.getCollectionsIdsFromLikeId({ likes: user.likes });
            collectionIds = havecollectionsIds.map(item => item.collectionId);
        }
        try {
            const collections = await services_1.collectionService.getCollectionByCollectiIds({ collectionIds, session });
            const transformedCollectionProducts = [];
            const TransfomedCollections = [];
            for (const collection of collections) {
                const transformedCollectionProductsNew = [];
                for (const id of collection.Ids) {
                    const product = await services_1.productService.getByIdWithString(id);
                    if (product) {
                        const simplifiedProduct = {
                            image: product.image_url,
                            id: product.id,
                            category: product.category,
                            name: product.name,
                            subCategory: product.subCategory,
                            price: product.price,
                            webLink: product.webLink,
                            link: product.link,
                            review: Array.isArray(product.review) ? product.review : [],
                            description: product.description
                        };
                        transformedCollectionProductsNew.push(simplifiedProduct);
                    }
                }
                const existsLike = user ? (await services_1.likeandUnlikeService.IslikeByUserIdCollectionIdExsist({
                    userId: user.id,
                    collectionId: collection?.id
                })) : null;
                const simplifiedCollection = {
                    name: collection.name,
                    description: collection.description,
                    products: transformedCollectionProductsNew,
                    collectionId: collection.id,
                    ...(existsLike != null && { likestatus: existsLike })
                };
                TransfomedCollections.push(simplifiedCollection);
            }
            await session.commitTransaction();
            session.endSession();
            const response = {
                data: TransfomedCollections,
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            };
            console.log("responserrrrrttrt", response);
            return res.status(http_status_codes_1.StatusCodes.OK).json(response);
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
    collectionbyColletionId: async (req, res) => {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        const collectionId = req.params.collectionId;
        try {
            const collection = await services_1.collectionService.getCollectioById(collectionId, session);
            const transformedCollectionProductsNew = [];
            if (collection?.Ids) {
                for (const id of collection?.Ids) {
                    const product = await services_1.productService.getByIdWithString(id);
                    if (product) {
                        const simplifiedProduct = {
                            image: product.image_url,
                            id: product.id,
                            category: product.category,
                            name: product.name,
                            subCategory: product.subCategory,
                            price: product.price,
                            webLink: product.webLink,
                            link: product.link,
                            review: Array.isArray(product.review) ? product.review : [],
                            description: product.description
                        };
                        transformedCollectionProductsNew.push(simplifiedProduct);
                    }
                }
            }
            else {
                console.warn('error');
            }
            const simplifiedCollection = {
                name: collection?.name,
                description: collection?.description,
                products: transformedCollectionProductsNew,
                collectionId: collection?.id,
            };
            await session.commitTransaction();
            session.endSession();
            const response = {
                data: simplifiedCollection,
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            };
            return res.status(http_status_codes_1.StatusCodes.OK).json(response);
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
    deletecollection: async (req, res) => {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        const collectionId = req.params.collectionId;
        try {
            console.log("responsesucessfull");
            await services_1.collectionService.deleteCollectioById(collectionId, session);
            await session.commitTransaction();
            session.endSession();
            const response = {
                data: "sucessfully deletec colletion",
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            };
            console.log("responsesucessfull");
            return res.status(http_status_codes_1.StatusCodes.OK).json(response);
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
    collectionUpdate: async (req, res) => {
        console.log("collectionUpload");
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const collectionId = req.params.collectionId;
            const { user } = req.context;
            const userId = user.id;
            const { name, description, Ids, collectionCategory } = req.body;
            const collection = await services_1.collectionService.updateCollection({
                name,
                description,
                Ids,
                userId,
                collectionCategory,
                collectionId,
                session
            });
            console.log("collection", collection);
            await session.commitTransaction();
            session.endSession();
            const response = res.status(http_status_codes_1.StatusCodes.OK).json({
                data: "collection updated",
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
    collectionbyUserId: async (req, res) => {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        const { user } = req.context;
        const userId = user.id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        try {
            const catgeoryQuery = req.query.categoryQuery;
            const likedQuery = req.query.likedQuery;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 6;
            const { user } = req.context;
            const userId = user.id;
            const collections = await services_1.collectionService.getCollectionByUserIdforPagination(userId, limit, page, session);
            const transformedCollectionProducts = [];
            const TransfomedCollections = [];
            for (const collection of collections.docs) {
                const transformedCollectionProductsNew = [];
                for (const id of collection.Ids) {
                    const product = await services_1.productService.getByIdWithString(id);
                    if (product) {
                        const simplifiedProduct = {
                            image: product.image_url,
                            id: product.id,
                            category: product.category,
                            name: product.name,
                            webLink: product.webLink,
                            subCategory: product.subCategory,
                            price: product.price,
                            link: product.link,
                            review: Array.isArray(product.review) ? product.review : [],
                            description: product.description
                        };
                        transformedCollectionProductsNew.push(simplifiedProduct);
                    }
                }
                const existsLike = user ? (await services_1.likeandUnlikeService.IslikeByUserIdCollectionIdExsist({
                    userId: user.id,
                    collectionId: collection?.id
                })) : null;
                const simplifiedCollection = {
                    name: collection.name,
                    categories: collection.collectionCategory,
                    description: collection.description,
                    products: transformedCollectionProductsNew,
                    collectionId: collection.id,
                    ...(existsLike != null && { likestatus: existsLike })
                };
                TransfomedCollections.push(simplifiedCollection);
            }
            await session.commitTransaction();
            session.endSession();
            const response = {
                data: { simplifiedCollection: TransfomedCollections, totalDocs: collections.totalDocs },
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            };
            console.log("response", response);
            return res.status(http_status_codes_1.StatusCodes.OK).json(response);
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
    collectionLikeUnlike: async (req, res) => {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const { user } = req.context;
            const id = user.id;
            const collectionId = req.params.collectionId;
            const collection = await services_1.collectionService.getCollectioById(collectionId, session);
            const exsistedLike = await services_1.likeandUnlikeService.likeByUserIdCollectionId({ userId: id, collectionId: collection?.id });
            if (exsistedLike) {
                await services_1.likeandUnlikeService.deleteLike({ userId: id, collectionId: collection?.id });
                await services_1.collectionService.removeLikeFromCollection(collection?.id, exsistedLike.id, session);
                await services_1.userService.removeLikeFromUser(user?.id, exsistedLike.id, session);
            }
            else {
                const createdLike = await services_1.likeandUnlikeService.createLike({ userId: id, collectionId: collection?.id });
                await services_1.collectionService.addLikeToCollection({ collectionId: collection?.id, createdLikeId: createdLike.id });
                await services_1.userService.addLikeToUser({ userId: user?.id, createdLikeId: createdLike.id });
            }
            await session.commitTransaction();
            session.endSession();
            const response = {
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            };
            return res.status(http_status_codes_1.StatusCodes.OK).json(response);
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
};
