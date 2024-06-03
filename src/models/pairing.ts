import { Schema, model } from 'mongoose'
import { IPairing } from '@/contracts/product'
const schema = new Schema<IPairing>(
  {
    id: String,
    look: String,
    desc: String,
    expected_delivery: String,
    cart: [{
      type: Schema.Types.ObjectId,
      ref: 'product'
    }],
    overall_description: String
  },
  {}
)
export const Pairing = model<IPairing>('Pairing', schema)
