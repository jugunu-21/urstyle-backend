import { ClientSession, ObjectId } from 'mongoose'

import { Product } from '@/models'
import { error } from 'console'
import { ok } from 'assert'
import { deleteFromCloudinaryWithUrl } from '../utils/cloudinary'
export const productService = {
  create: (
    {
      pid,
      name,
      code,
      link,
      image_url,
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
      price,
      review,
      description,
      userId,
      verified
    }).save({ session }),

  getById: (productId: ObjectId) => Product.findById(productId),
  getByIdHavingSomeFields: ({productId}:{productId: ObjectId}) => Product.findById(productId).select({
    image_url: 1,
    id: 1,
    pid: 1,
    name: 1,
    code: 1,
    price: 1,
    link: 1,
    review: 1,
    description: 1
  }),
  getByIdWithString: async(productId: string) => await Product.findById(productId),
  updateProductByProductId: async (
    productId: string,
    { name, price, description, code, link, pid, image_url, response }: {
      pid: number,
      name: string,
      code: string,
      link: string,
      price: string,
      image_url: string
      description: string
      response?: string
    },
    session?: ClientSession
  ) => {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      if (response) {
        await deleteFromCloudinaryWithUrl(product.image_url)
      }

      const data = [{ _id: productId }, { name, price, description, link, code, pid, image_url }]
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
  getProductsByUser: async (userId: ObjectId, session: ClientSession) => {
    try {
      const products = await Product.find({ userId }).session(session);
      return products;
    } catch (error) {
      console.error('Error fetching products by user:', error);
      throw error;
    }
  },
  getProductsByUserForPagination: async (userId: ObjectId, session: ClientSession, limit: number, page: number) => {
    return Product.paginate({ userId }, { page, limit, session })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  },

  deleteById: async (userId: string, session?: ClientSession) => {
    try {
      const product = await Product.findById(userId)
      if (!product) {
        throw new Error('Product not found');
      }
      await deleteFromCloudinaryWithUrl(product.image_url)
      return Product.deleteOne({ user: userId }, { session })
    }
    catch { error }
    console.error("doesnot exist any product with this id ")
    throw error;
  }

  //
}
