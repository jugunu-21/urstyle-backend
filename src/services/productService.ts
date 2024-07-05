import { ClientSession, ObjectId } from 'mongoose'

import { Product } from '@/models'

export const productService = {
  create: (
    {
      pid,
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
      userId,
      verified = false
    }: {
      pid?: number
      code: string
      link?: string
      image_url: {
        public_id: string,
        url: string
      }
      price: string
      name: string
      review?: string
      description?: string
      userId?: ObjectId
      verified?: boolean
    },
    session?: ClientSession
  ) =>
    new Product({
      pid,
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
      userId,
      verified
    }).save({ session }),

  getById: (userId: ObjectId) => Product.findById(userId),

  updateProductByProductId: (
    productId: ObjectId,
    { name, price, description, code, link, }: {
      pid: number,
      name: string,
      code: string,
      link: string,
      price: string,
      description: string
    },
    session?: ClientSession
  ) => {
    const data = [{ _id: productId }, { name, price,  description,link,code }]

    let params = null

    if (session) {
      params = [...data, { session }]
    } else {
      params = data
    }

    return Product.updateMany(...params)
  },

  deleteById: (userId: ObjectId, session?: ClientSession) =>
    Product.deleteOne({ user: userId }, { session })

  //
}
