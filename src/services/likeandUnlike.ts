import { ClientSession, ObjectId } from 'mongoose'
import { Like } from "@/models/like"
import { ILike } from '@/contracts/like'
export const likeandUnlikeService = {
    createLike: ({ userId, collectionId }: {
        userId: ObjectId, collectionId: ObjectId
    }, session?: ClientSession) => {
        const createdLike=new Like({ userId, collectionId }).save({ session })
        console.log("like created")
        return createdLike
    },
    likeByUserIdCollectionId: async ({ userId, collectionId }: {
        userId: ObjectId, collectionId: ObjectId
    }, session?: ClientSession) => {
        const existingLike = await Like.findOne({ userId, collectionId }, {}, { session });
        return existingLike;
    },
    likeByUserId: async ({ userId }: {
        userId: ObjectId
    }, session?: ClientSession) => {
        const existingLike = await Like.find({ userId}, {}, { session });
        return existingLike;
    },
    getCollectionsIdsFromLikeId: async ({ likes }: {
        likes: ILike[]
    }, session?: ClientSession) => {
        const existingLikes = await Like.find({
            _id: { $in: likes }
        }, { collectionId: 1 }, { session });
        return existingLikes;
    },
    IslikeByUserIdCollectionIdExsist: async ({ userId, collectionId }: {
        userId: ObjectId, collectionId: ObjectId
    }, session?: ClientSession) => {
    
        const existingLike = await Like.findOne({ userId, collectionId }, {}, { session });
        return !!existingLike;
    },
    deleteLike: async ({ userId, collectionId }: {
        userId: ObjectId, collectionId: ObjectId
    }, session?: ClientSession) => {
        try { await Like.findOneAndRemove({ userId, collectionId }, { session }); }
        catch (error) { return null }
    },
    
    deleteLikeById: async ({ likeId }: {
        likeId: ObjectId
    }, session?: ClientSession) => {
        try { await Like.deleteOne({ _id: likeId }, { session }); }
        catch (error) { return null }
    }
}

