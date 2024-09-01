import { ClientSession, ObjectId } from 'mongoose'
import { Like } from "@/models/like"
export const likeandUnlikeService = {
    createLike: ({ userId, collectionId }: {
        userId: ObjectId, collectionId: ObjectId
    }, session?: ClientSession) => {
        new Like({ userId, collectionId }).save({ session })

    },
    isExistByUserIdCollectionId: async({ userId, collectionId }: {
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
        try { await Like.deleteOne({_id: likeId}, { session }); }
        catch (error) { return null }
    }


}

