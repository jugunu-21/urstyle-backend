import { ClientSession, ObjectId } from 'mongoose'

import { User } from '@/models'
import { error } from 'console'

export const userService = {
  create: (
    {
   
      phone_number,
   
      verified = false
    }: {
   
      phone_number: string
  
      verified?: boolean
    },
    session?: ClientSession
  ) =>
    new User({
   
      phone_number,
   
      verified
    }).save({ session }),


  getById: (userId: ObjectId) => User.findById(userId),
  // addLikeToUser:()=>{},
  addLikeToUser: async ({userId,createdLikeId}:{userId: ObjectId, createdLikeId: ObjectId}) => await User.findByIdAndUpdate(
    userId,
    { $push: { likes: createdLikeId } },
    { new: true }
  ),

  removeLikeFromUser: async (
    collectionId: string,
    likeId: string,
    session: any
  ) => {
    await User.findOneAndUpdate(
      { _id: collectionId },
      { $pull: { likes: { $in: [likeId] } } },
      { session }
    );
  },
  getByEmail: (email: string) => User.findOne({ email }),
  getByphone_number: (phone_number: string) => User.findOne({phone_number }),

  isExistByphone_number: (phone_number: string) => User.exists({ phone_number }),
  updatePasswordByUserId: (
    userId: ObjectId,
    password: string,
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { password, resetPasswords: [] }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  // updateVerificationAndEmailByUserId: (
  //   userId: ObjectId,
  //   email: string,
  //   session?: ClientSession
  // ) => {
  //   const data = [{ _id: userId }, { email, verified: true, verifications: [] }]

  //   let params = null

  //   if (session) {
  //     params = [...data, { session }]
  //   } else {
  //     params = data
  //   }

  //   return User.updateOne(...params)
  // },

  updateProfileByUserId: (
    userId: ObjectId,
    { firstName, lastName }: { firstName: string; lastName: string },
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { firstName, lastName }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return User.updateOne(...params)
  },

  // updateEmailByUserId: (
  //   userId: ObjectId,
  //   email: string,
  //   session?: ClientSession
  // ) => {
  //   const data = [{ _id: userId }, { email, verified: false }]

  //   let params = null

  //   if (session) {
  //     params = [...data, { session }]
  //   } else {
  //     params = data
  //   }

  //   return User.updateOne(...params)
  // },

  deleteById: (userId: ObjectId, session?: ClientSession) =>
    User.deleteOne({ _id: userId }, { session }),

  // addResetPasswordToUser: async (
  //   {
  //     userId,
  //     resetPasswordId
  //   }: {
  //     userId: ObjectId
  //     resetPasswordId: ObjectId
  //   },
  //   session?: ClientSession
  // ) => {
  //   let options = {}

  //   if (session) {
  //     options = { session }
  //   }

  //   const user = await User.findOne({ _id: userId }, null, options)

  //   if (user) {
  //     if (!user.resetPasswords) {
  //       user.resetPasswords = []
  //     }
  //     user.resetPasswords.push(resetPasswordId)
  //     await user.save({ session })
  //   }
  // },

  addVerificationToUser: async (
    {
      userId,
      verificationId
    }: {
      userId: ObjectId
      verificationId: ObjectId
    },
    session?: ClientSession
  ) => {
    let options = {}

    if (session) {
      options = { session }
    }

    const user = await User.findOne({ _id: userId }, null, options)

    if (user) {
      if (!user.verifications) {
        user.verifications = []
      }
      user.verifications.push(verificationId)
      await user.save({ session })
    }
  }
}
