import { ClientSession, ObjectId } from 'mongoose'

import { Product } from '@/models'
import { error } from 'console'
import { ok } from 'assert'

export const productService = {
  create: (
    {
      pid,
      name,
      code,
      link,
      image_url,
      // image_url: {
      //   public_id,
      //   url
      // },
      price,
      review,
      description,
      userId,
      verified = false
    }: {
      pid?: number
      code: string
      link?: string
      image_url?: string
      // image_url: {
      //   public_id: string,
      //   url: string
      // }
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
      image_url,
      // image_url: {
      //   public_id,
      //   url
      // },
      price,
      review,
      description,
      userId,
      verified
    }).save({ session }),

  getById: (userId: ObjectId) => Product.findById(userId),

  updateProductByProductId: async (
    productId: string,
    { name, price, description, code, link, pid }: {
      pid: number,
      name: string,
      code: string,
      link: string,
      price: string,
      description: string
    },
    session?: ClientSession
  ) => {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('Product not found'); // Throw an error if the product does not exist
      }
      //     const fieldsToUpdate = { name, price, description, link, code, pid };
      // const missingFields = Object.entries(fieldsToUpdate).filter(([key, value]) => value === undefined || value === null ||  (typeof value === 'string' && value.trim() === ''));

      // if (missingFields.length > 0) {
      //   throw new Error(`Missing fields: ${missingFields.map(([key]) => key).join(', ')}`);
      // }
      const data = [{ _id: productId }, { name, price, description, link, code, pid }]

      let params = null

      if (session) {
        params = [...data, { session }]
      } else {
        params = data
      }

      return Product.updateMany(...params)
    }
    catch { error }
    console.error('Error updating product:', error);
    throw error;
  },
  getproductsbyuser: async (userId: ObjectId, session: ClientSession) => {
    try {
      const products = await Product.find({ userId }).session(session);
      return products;
    } catch (error) {
      console.error('Error fetching products by user:', error);
      throw error;
    }
  },

  updateProductImageByProductId: async (
    productId: string,
    image_url: string,
    session?: ClientSession
  ) => {
    try {
      const product = await Product.findById(productId)
      if (!product) {
        throw new Error('Product not found');
      }
      const data = [{ _id: productId }, { image_url: image_url }]
      let params = null
      if (session) {
        params = [...data, { session }]
      } else {
        params = data
      }
      return Product.updateOne(...params)
    } catch { error }
    console.error('Error updating product:', error);
    throw error;
  },
  deleteById: async (userId: string, session?: ClientSession) => {
    try {
      const product = await Product.findById(userId)
      if (!product) {
        throw new Error('Product not found');
      }

      return Product.deleteOne({ user: userId }, { session })
    }
    catch { error }
    console.error("doesnot exist any product with this id ")
    throw error;
  }

  //
}
