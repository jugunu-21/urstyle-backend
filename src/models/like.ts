import { Schema, model } from 'mongoose'
import mongoose from 'mongoose';
import { ILike } from '@/contracts/like'
const LikeSchema = new Schema<ILike>({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    collectionId: { type: Schema.Types.ObjectId, ref: 'Collection' },
});
export const Like = model<ILike>('Like', LikeSchema)