import { ClientSession, ObjectId } from 'mongoose'
import { Collection } from '@/models'
import { error } from 'console'
import { ok } from 'assert'

export const collectionService = {
  create: (
    {
      name,
      Ids,
      description,
      userId,
      verified = false
    }: {
      name: string
      description: string
      userId: ObjectId
      Ids: string[]
      verified?: boolean
    },
    session?: ClientSession
  ) =>
    new Collection({
      name,
      Ids,
      description,
      userId,
      verified
    }).save({ session }),
  deleteById: async (userId: string, session?: ClientSession) => {
    try {
      const product = await Collection.findById(userId)
      if (!product) {
        throw new Error('Product not found');
      }

      return Collection.deleteOne({ user: userId }, { session })
    }
    catch { error }
    console.error("doesnot exist any product with this id ")
    throw error;
  },
  getCollectioById:async(collectionId:string,session?: ClientSession)=>{

    const collection= await Collection.findById(collectionId)
    return collection
  },
  getCollectionByUser: async (userId: ObjectId, session: ClientSession) => {
    try {
      const products = await Collection.find({ userId }).session(session);
      return products;
    } catch (error) {
      console.error('Error fetching products by user:', error);
      throw error;
    }
  },
  addLikeToCollection: async (
    collectionId: string,
    likeId: ObjectId,
    session: any
  ) => {
    await Collection.findByIdAndUpdate(
      collectionId,
      { $push: { likes: likeId } },
      { session }
    );
  },
  
  removeLikeFromCollection: async (
    collectionId: string,
    userId: string,
    session: any
  ) => {
    await Collection.updateOne(
      { _id: collectionId },
      { $pull: { likes: { $in: [userId] } } },
      { session }
    );
  },
  
  addDislikeToCollection: async (
    collectionId: string,
    userId: string,
    session: any
  ) => {
    await Collection.updateOne(
      { _id: collectionId },
      { $addToSet: { dislikes: userId } },
      { session }
    );
  },
  //   getById: (userId: ObjectId) => Product.findById(userId),

  //   updateProductByProductId: async (
  //     productId: string,
  //     { name, price, description, code, link, pid, image_url,response }: {
  //       pid: number,
  //       name: string,
  //       code: string,
  //       link: string,
  //       price: string,
  //       image_url: string
  //       description: string
  //       response?:string
  //     },
  //     session?: ClientSession
  //   ) => {
  //     try {
  //       const product = await Product.findById(productId);

  //       if (!product) {
  //         throw new Error('Product not found'); // Throw an error if the product does not exist
  //       }
  //       if(response){
  //         await deleteFromCloudinaryWithUrl(product.image_url)
  //       }

  //       const data = [{ _id: productId }, { name, price, description, link, code, pid, image_url }]

  //       let params = null

  //       if (session) {
  //         params = [...data, { session }]
  //       } else {
  //         params = data
  //       }

  //       return Product.updateMany(...params)
  //     }
  //     catch { error }
  //     console.error('Error updating product:', error);
  //     throw error;
  //   },
  //   getProductsByUser: async (userId: ObjectId, session: ClientSession) => {
  //     try {
  //       const products = await Product.find({ userId }).session(session);
  //       return products;
  //     } catch (error) {
  //       console.error('Error fetching products by user:', error);
  //       throw error;
  //     }
  //   },

  //   // getProductsByUserForPagination: async (userId: ObjectId, session: ClientSession,limit:number,page:number) => {
  //   //   try {
  //   //     const products = await Product.find({ userId }).session(session)
  //   //       .skip((page - 1) * limit)
  //   //       .limit(limit);

  //   //       return products;
  //   //   } catch (error) {
  //   //     throw error;
  //   //   }

  //   // },
  //   getProductsByUserForPagination: async (userId: ObjectId, session: ClientSession, limit: number, page: number) => {

  //     return Product.paginate({}, { page, limit })
  //       .then((result) => {
  //     //  console.log("result",result)
  //         return result; // This returns the docs from the resolved promise
  //       })
  //       .catch((err) => {

  //         throw err; // Ensure you're throwing the caught error to handle it properly in the calling code
  //       });
  //   },



  //
}
