import { ClientSession, ObjectId } from 'mongoose'
import { Like } from "@/models/like"
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

