"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeandUnlikeService = void 0;
const like_1 = require("../models/like");
exports.likeandUnlikeService = {
    createLike: ({ userId, collectionId }, session) => {
        const createdLike = new like_1.Like({ userId, collectionId }).save({ session });
        console.log("like created");
        return createdLike;
    },
    likeByUserIdCollectionId: async ({ userId, collectionId }, session) => {
        const existingLike = await like_1.Like.findOne({ userId, collectionId }, {}, { session });
        return existingLike;
    },
    likeByUserId: async ({ userId }, session) => {
        const existingLike = await like_1.Like.find({ userId }, {}, { session });
        return existingLike;
    },
    getCollectionsIdsFromLikeId: async ({ likes }, session) => {
        const existingLikes = await like_1.Like.find({
            _id: { $in: likes }
        }, { collectionId: 1 }, { session });
        return existingLikes;
    },
    IslikeByUserIdCollectionIdExsist: async ({ userId, collectionId }, session) => {
        const existingLike = await like_1.Like.findOne({ userId, collectionId }, {}, { session });
        return !!existingLike;
    },
    deleteLike: async ({ userId, collectionId }, session) => {
        try {
            await like_1.Like.findOneAndRemove({ userId, collectionId }, { session });
        }
        catch (error) {
            return null;
        }
    },
    deleteLikeById: async ({ likeId }, session) => {
        try {
            await like_1.Like.deleteOne({ _id: likeId }, { session });
        }
        catch (error) {
            return null;
        }
    }
};
