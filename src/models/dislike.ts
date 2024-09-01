import { Schema, model } from 'mongoose'
import mongoose from 'mongoose';
import {IDislike} from '@/contracts/dislike'
const DislikeSchema = new Schema<IDislike>({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    collectionId: { type: Schema.Types.ObjectId, ref: 'Collection' },
});
export const Dislike = model<IDislike>('Dislike', DislikeSchema)