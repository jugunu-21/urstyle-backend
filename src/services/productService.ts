import { ClientSession, ObjectId } from 'mongoose'

import { Product } from '@/models'

export const productService = {
  create: (
    {
      id,
      name,
      code,
      link,
      image_url: {
        public_id,
        url
      },
      price,
      review,
      description,
      verified = false
    }: {
      id?: number
      code: string
      link?: string
      image_url: {
          public_id: string,
          url:string
      } 
      price: string
      name: string
      review?: string
      description?: string
      verified?: boolean
    },
    session?: ClientSession
  ) =>
    new Product({
      id,
      name,
      code,
      link,
      image_url: {
        public_id,
        url
      },
      price,
      review,
      description,
      verified
    }).save({ session }),

  getById: (userId: ObjectId) => Product.findById(userId),

  updateProductByProductId: (
    userId: ObjectId,
    { name, price }: { name: string; price: string },
    session?: ClientSession
  ) => {
    const data = [{ _id: userId }, { name, price }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return Product.updateOne(...params)
  },

  deleteById: (userId: ObjectId, session?: ClientSession) =>
    Product.deleteOne({ user: userId }, { session })

  //
}
