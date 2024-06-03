import { Schema, model } from 'mongoose'
import { IReview } from '@/contracts/user'
const schema = new Schema<IReview>(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    rname: String,
    data: String,
    content: String,
    rating: String
  },

  { timestamps: true }
)
export const Review = model<IReview>('Review', schema)
