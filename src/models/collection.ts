import { Schema, model } from 'mongoose'
import { ICart } from '@/contracts/user'
const schema = new Schema<ICart>({
    id:String,
    look:String,
     desc: String,
    expected_delivery: String,
    cart: {
        type: Schema.Types.ObjectId,
        ref:'item'
     },
     overall_description:String, 
},
    {}
)
export const collection = model<ICart>("collection", schema);