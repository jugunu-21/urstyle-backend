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

  getById: (userId: ObjectId) => Product.findById(userId),

  updateProductByProductId: async (
    productId: string,
    { name, price, description, code, link, pid, image_url }: {
      pid: number,
      name: string,
      code: string,
      link: string,
      price: string,
      image_url: string
      description: string
    },
    session?: ClientSession
  ) => {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('Product not found'); // Throw an error if the product does not exist
      }
      if(image_url){
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
 
  // getProductsByUserForPagination: async (userId: ObjectId, session: ClientSession,limit:number,page:number) => {
  //   try {
  //     const products = await Product.find({ userId }).session(session)
  //       .skip((page - 1) * limit)
  //       .limit(limit);
  
  //       return products;
  //   } catch (error) {
  //     throw error;
  //   }
  
  // },
  getProductsByUserForPagination: async (userId: ObjectId, session: ClientSession, limit: number, page: number) => {
    // console.log("iteman limit",limit)
    // console.log("iteman page",page)
    return Product.paginate({}, { page, limit })
      .then((result) => {
    //  console.log("result",result)
        return result; // This returns the docs from the resolved promise
      })
      .catch((err) => {
       
        throw err; // Ensure you're throwing the caught error to handle it properly in the calling code
      });
  },
  // updateProductImageByProductId: async (
  //   productId: string,
  //   image_url: string,
  //   session?: ClientSession
  // ) => {
  //   try {
  //     const product = await Product.findById(productId)
  //     if (!product) {
  //       throw new Error('Product not found');
  //     }
  //     const data = [{ _id: productId }, { image_url: image_url }]
  //     let params = null
  //     if (session) {
  //       params = [...data, { session }]
  //     } else {
  //       params = data
  //     }
  //     return Product.updateOne(...params)
  //   } catch { error }
  //   console.error('Error updating product:', error);
  //   throw error;
  // },
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
