"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionService = void 0;
const models_1 = require("../models");
const console_1 = require("console");
exports.collectionService = {
    create: ({ name, Ids, description, userId, collectionCategory, verified = false }, session) => new models_1.Collection({
        name,
        Ids,
        description,
        collectionCategory,
        userId,
        verified
    }).save({ session }),
    updateCollection: async ({ name, Ids, description, collectionId, collectionCategory, userId, session, }) => {
        try {
            console.log("collectionId", collectionId);
            const collection = await models_1.Collection.findById(collectionId);
            if (!collection) {
                throw new Error('Collection not found');
            }
            const updateData = {
                name,
                Ids,
                description,
                collectionCategory,
            };
            const filter = { id: collectionId };
            const options = session ? { session } : {};
            const result = await models_1.Collection.updateOne(filter, updateData, options);
            if (result.modifiedCount === 0) {
                console.warn('No documents were updated.');
            }
            return result;
        }
        catch (error) {
            console.error('Error updating collection:', error);
            throw error;
        }
    },
    getCollectioById: async (collectionId, session) => {
        const collection = await models_1.Collection.findById(collectionId);
        return collection;
    },
    deleteCollectioById: async (collectionId, session) => {
        try {
            const collection = await models_1.Collection.findById(collectionId);
            if (!collection) {
                throw new Error('collection not found');
            }
            return models_1.Collection.deleteOne({ _id: collectionId }, { session });
        }
        catch {
            console_1.error;
        }
        console.error("doesnot exist any product with this id ");
        throw console_1.error;
    },
    getCollectioByUserId: async (userId, session) => {
        const collection = await models_1.Collection.findById({ userId });
        return collection;
    },
    getCollectionByUserIdforPagination: async (userId, limit, page, session) => {
        return models_1.Collection.paginate({ userId }, { page, limit, session }).then((result) => {
            return result;
        }).catch((err) => {
            throw err;
        });
    },
    getCollectioByobjcetId: async (collectionId, session) => {
        const collection = await models_1.Collection.findById(collectionId);
        return collection;
    },
    getCollectioByIdHavingFields: async (collectionId, session) => {
        const collection = await models_1.Collection.findById(collectionId).select({});
        return collection;
    },
    getMultipleCollectionsByIds: async (collectionIds, session) => {
        try {
            const collections = await models_1.Collection.find({
                _id: { $in: collectionIds }
            }, {}, { session });
            return collections;
        }
        catch (error) {
            console.error('Error fetching collections:', error);
            throw error;
        }
    },
    addLikeToCollection: async ({ collectionId, createdLikeId }) => await models_1.Collection.findByIdAndUpdate(collectionId, { $push: { likes: createdLikeId } }, { new: true }),
    getCollection: async (session) => {
        try {
            const products = await models_1.Collection.find({}).session(session);
            return products;
        }
        catch (error) {
            console.error('Error fetching products by user:', error);
            throw error;
        }
    },
    getCollectionByCollectiIds: async ({ collectionIds, session }) => {
        try {
            const collections = await models_1.Collection.find({
                _id: { $in: collectionIds }
            }, {}, { session });
            return collections;
        }
        catch (error) {
            console.error('Error fetching collections:', error);
            throw error;
        }
    },
    getCollectionByUserId: async (session) => {
        try {
            const products = await models_1.Collection.find({}).session(session);
            return products;
        }
        catch (error) {
            console.error('Error fetching products by user:', error);
            throw error;
        }
    },
    checkProductsInCollectionsByProductId: async ({ productId, session }) => {
        try {
            const collections = await models_1.Collection.find({ Ids: { $in: [productId] } }).session(session);
            for (const collection of collections) {
                const idsLength = collection.Ids.length;
                console.log(`Processing collection with ${idsLength} IDs`);
                if (idsLength === 1) {
                    console.log('Deleting single-IDs collection');
                    await models_1.Collection.deleteOne({ _id: collection._id }).session(session);
                    console.log('Deleting single-IDs collection', collection);
                }
                else {
                    console.log('Updating multi-IDs collection');
                    await models_1.Collection.updateOne({ _id: collection._id }, { $pull: { Ids: productId } }).session(session);
                    console.log('Updating multi-IDs collection', collection);
                }
            }
        }
        catch (error) {
            console.error('Error checking collections by product ID:', error);
            throw error;
        }
    },
    getCollectionByQuery: async (categoryQuery, session) => {
        try {
            const collections = await models_1.Collection.find({}).session(session);
            const filteredCollections = collections.filter(collection => collection.collectionCategory && collection.collectionCategory.includes(categoryQuery));
            return filteredCollections;
        }
        catch (error) {
            console.error('Error fetching products by user:', error);
            throw error;
        }
    },
    removeLikeFromCollection: async (collectionId, likId, session) => {
        await models_1.Collection.findOneAndUpdate({ _id: collectionId }, { $pull: { likes: { $in: [likId] } } }, { session });
    },
    addDislikeToCollection: async (collectionId, userId, session) => {
        await models_1.Collection.updateOne({ _id: collectionId }, { $addToSet: { dislikes: userId } }, { session });
    },
};
