
import { Schema, model } from 'mongoose'
import { IItem } from '@/contracts/user'
const schema = new Schema<IItem>(
    {
    id: Number,
    name: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        
    },
    code: String,
    link: String,
        image_url: String,
        price: String,
        review: {
            type: Schema.Types.ObjectId,
            ref:'review'
        },
        description:String
    }

, { timestamps:true });
export const Item = model<IItem>("Items", schema);
    
