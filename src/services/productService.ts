import { ClientSession, ObjectId } from 'mongoose'

import { Product } from '@/models'
import { error } from 'console'
import { ok } from 'assert'
import { deleteFromCloudinaryWithUrl } from '../utils/cloudinary'
export const productService = {
  create: (
    {
      category,
      name,
      subCategory,
      webLink,
      link,
      image_url,
      price,
      review,
      description,
      userId,
      verified = false
    }: {
      category?: string
      subCategory: string
      link?: string
      image_url?: string
      price: string
      name: string
      webLink: string
      review?: string
      description?: string
      userId?: ObjectId
      verified?: boolean
    },
    session?: ClientSession
  ) =>
    new Product({
      category,
      name,
      subCategory,
      link,
      image_url,
      price,
      review,
      webLink,
      description,
      userId,
      verified
    }).save({ session }),

  getById: (productId: ObjectId) => Product.findById(productId),
  getByIdHavingSomeFields: ({ productId }: { productId: ObjectId }) => Product.findById(productId).select({
    image_url: 1,
    id: 1,
    category: 1,
    name: 1,
    subCategory: 1,
    price: 1,
    webLink: 1,
    link: 1,
    review: 1,
    description: 1
  }),
  getByIdWithString: async (productId: string) => await Product.findById(productId),
  updateProductByProductId: async (
    productId: string,
    { name, price, description, subCategory, webLink, link, category, image_url, response }: {
      category: string,
      name: string,
      subCategory: string,
      link: string,
      webLink: string,
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

      const data = [{ _id: productId }, { webLink, name, price, description, link, subCategory, category, image_url }]
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

  deleteByProductId: async (productId: string, session?: ClientSession) => {
    try {
      const product = await Product.findById(productId)
      if (!product) {
        throw new Error('Product not found');
      }

      await deleteFromCloudinaryWithUrl(product.image_url)

      return Product.deleteOne({ _id: productId }, { session })

    }
    catch { error }
    console.error("doesnot exist any product with this id ")
    throw error;
  }

  //
}
