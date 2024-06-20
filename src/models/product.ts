import { Schema, model } from 'mongoose'
import { IProduct } from '@/contracts/product'
const schema = new Schema<IProduct>(
  {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    image_url: {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },

    price: {
      type: String,
      required: true
    },
    review: [
      {
        type: Schema.Types.ObjectId,
        ref: 'review'
      }
    ],
    description: String
  },

  { timestamps: true }
)
export const Product = model<IProduct>('Product', schema)
export type productPayload = Pick<IProduct, 'name'>
