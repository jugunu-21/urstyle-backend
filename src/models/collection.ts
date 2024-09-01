import { Schema, model } from 'mongoose'
import mongoose from 'mongoose';
import { ICollection } from '@/contracts/collection'
const schema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    Ids: [{
      type: String,
      required: true
    }],
    likes: [{
       type: Schema.Types.ObjectId, 
       ref: 'Like' 
      }],
    dislikes: [{
       type: Schema.Types.ObjectId, 
       ref: 'Dislike'
       }]
  },
  { timestamps: true }
) 
export const Collection = model<ICollection>('Collection', schema)

