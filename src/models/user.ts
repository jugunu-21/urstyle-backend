import { Schema, model } from 'mongoose'
import { compareSync } from 'bcrypt'

import { IUser, IUserMethods, UserModel } from '@/contracts/user'

const schema = new Schema<IUser>(
  {
   
    phone_number: String,
    // otp: String,
 
    verified: {
      type: Boolean,
      default: false
    },
    likes: [{ type: Schema.Types.ObjectId,  ref: 'Like' }],
    dislikes: [{type: Schema.Types.ObjectId,  ref: 'Dislike' }],
    verifications: [{ type: Schema.Types.ObjectId, ref: 'Verification' }],
    resetPasswords: [{ type: Schema.Types.ObjectId, ref: 'ResetPassword' }]
  },
  { timestamps: true }
)

// schema.methods.comparePassword = function (password: string) {
//   return compareSync(password, this.password)
// }

// schema.methods.toJSON = function () {
//   const obj = this.toObject()

//   delete obj.password
//   delete obj.verifications
//   delete obj.resetPasswords

//   return obj
// }

export const User = model<IUser, UserModel>('User', schema)
