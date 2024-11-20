import { Schema, model } from 'mongoose'
import mongoose from 'mongoose';
import { ICollection } from '@/contracts/collection'
import { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
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
    collectionCategory: [{
      type: String,
      required: true
    }],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    Ids: [{
      type: String,
      required: true
    }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'Dislike' }]
  },
  { timestamps: true }
)
interface CollectionDocument extends Document {
  name: string;
  description: string;
  collectionCategory: Array<string>;
  Ids: Array<string>;
  userId: string;
  likes: Array<string>;
  dislikes: Array<string>;
}
schema.plugin(paginate);



export const Collection = model<ICollection, mongoose.PaginateModel<CollectionDocument>>('Collection', schema)

