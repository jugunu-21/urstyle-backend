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
      category,
      verified = false
    }: {
      name: string
      description: string
      category: string[]
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
      category,
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
  getCollectioById: async (collectionId: string, session?: ClientSession) => {

    const collection = await Collection.findById(collectionId)
    return collection
  },
  addLikeToCollection: async ({collectionId,createdLikeId}:{collectionId: ObjectId, createdLikeId: ObjectId}) => await Collection.findByIdAndUpdate(
    collectionId,
    { $push: { likes: createdLikeId } },
    { new: true }
  ),
  getCollection: async (session: ClientSession) => {
    try {
      const products = await Collection.find({}).session(session);
      return products;
    } catch (error) {
      console.error('Error fetching products by user:', error);
      throw error;
    }
  },
  getCollectionByUser: async (session: ClientSession) => {
    try {
      const products = await Collection.find({}).session(session);
      return products;
    } catch (error) {
      console.error('Error fetching products by user:', error);
      throw error;
    }
  },
  getCollectionByQuery: async (categoryQuery: string, session: ClientSession) => {
    try {
      const collections = await Collection.find({}).session(session);

      // Filter collections based on category query
      const filteredCollections = collections.filter(collection =>
        collection.category && collection.category.includes(categoryQuery)
      );

      // Return the filtered collections
      // if(filteredCollections.length==0){
      //   return collections
      // }

      return filteredCollections;
    } catch (error) {
      console.error('Error fetching products by user:', error);
      throw error;
    }
  },
  // addLikeToCollection: async (
  //   collectionId: ObjectId,
  //   createdLikeId: ObjectId,
  //   session: any
  // ) => {
  //   await Collection.findByIdAndUpdate(
  //     collectionId,
  //     { $push: { likes: createdLikeId } },
  //     { session }
  //   );
  // },

  removeLikeFromCollection: async (
    collectionId: string,
    userId: string,
    session: any
  ) => {
    await Collection.findOneAndUpdate(
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
}
