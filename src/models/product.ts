import { Schema, model } from 'mongoose'
import mongoose from 'mongoose';
import { IProduct } from '@/contracts/product'
import { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const schema = new Schema<IProduct>(
  {
    category: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    subCategory: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    webLink: {
      type: String,
      required: true
    },
    image_url: {
      type: String,
      required: true
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
    description: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },

  { timestamps: true }
)
interface ProductDocument extends Document {
  category: string;
  name: string;
  subCategory: string;
  webLink: string;
  link: string;
  image_url: string;
  price: string;
  review: Array<string>; // Adjusted to Array<string> assuming review contains strings
  description?: string; // Made optional if it's not always required
  userId: string;
}
schema.plugin(paginate);
export const Product = model<IProduct, mongoose.PaginateModel<ProductDocument>>('Product', schema)
// export const Product = model<IProduct>('Product', schema)
export type productPayload = Pick<IProduct, 'name'>
