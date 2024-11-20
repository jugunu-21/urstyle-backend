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
      collectionCategory,
      verified = false
    }: {
      name: string
      description: string
      collectionCategory: string[]
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
      collectionCategory,
      userId,
      verified
    }).save({ session }),

  getCollectioById: async (collectionId: string, session?: ClientSession) => {
    const collection = await Collection.findById(collectionId)
    return collection
  },
  getCollectioByUserId: async (userId: string, session?: ClientSession) => {
    const collection = await Collection.findById({ userId })
    return collection
  },
  getCollectionByUserIdforPagination: async (userId: string, limit: number, page: number, session?: ClientSession,) => {
    return Collection.paginate({ userId }, { page, limit, session }).then((result) => {
      return result;
    }).catch((err) => {
      throw err;
    })
  },
  getCollectioByobjcetId: async (collectionId: object, session?: ClientSession) => {
    const collection = await Collection.findById(collectionId)
    return collection
  },
  getCollectioByIdHavingFields: async (collectionId: string, session?: ClientSession) => {
    const collection = await Collection.findById(collectionId).select({
    })
    return collection
  },
  getMultipleCollectionsByIds: async (collectionIds: string[], session?: ClientSession) => {
    try {
      const collections = await Collection.find({
        _id: { $in: collectionIds }
      }, {
      }, { session });
      return collections;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },
  addLikeToCollection: async ({ collectionId, createdLikeId }: { collectionId: ObjectId, createdLikeId: ObjectId }) => await Collection.findByIdAndUpdate(
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
  getCollectionByCollectiIds: async ({ collectionIds, session }: {
    collectionIds: object[],
    session?: ClientSession
  }
  ) => {
    try {
      const collections = await Collection.find({
        _id: { $in: collectionIds }
      }, {}, { session });

      return collections;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },
  getCollectionByUserId: async (session: ClientSession) => {
    try {
      const products = await Collection.find({}).session(session);
      return products;
    } catch (error) {
      console.error('Error fetching products by user:', error);
      throw error;
    }
  },
  checkProductsInCollectionsByProductId: async ({ productId, session }: { productId: string, session: ClientSession }) => {
    try {
      const collections = await Collection.find(
        { Ids: { $in: [productId] } }
      ).session(session);

      for (const collection of collections) {
        const idsLength = collection.Ids.length;
        console.log(`Processing collection with ${idsLength} IDs`);

        if (idsLength === 1) {
          console.log('Deleting single-IDs collection');
          await Collection.deleteOne({ _id: collection._id }).session(session);
          console.log('Deleting single-IDs collection', collection);
        } else {
          console.log('Updating multi-IDs collection');
          await Collection.updateOne(
            { _id: collection._id },
            { $pull: { Ids: productId } }
          ).session(session);
          console.log('Updating multi-IDs collection', collection);
        }
      }

    } catch (error) {
      console.error('Error checking collections by product ID:', error);
      throw error;
    }
  },
  getCollectionByQuery: async (categoryQuery: string, session: ClientSession) => {
    try {
      const collections = await Collection.find({}).session(session);
      const filteredCollections = collections.filter(collection =>
        collection.collectionCategory && collection.collectionCategory.includes(categoryQuery)
      );
      return filteredCollections;
    } catch (error) {
      console.error('Error fetching products by user:', error);
      throw error;
    }
  },
  removeLikeFromCollection: async (
    collectionId: string,
    likId: string,
    session: any
  ) => {
    await Collection.findOneAndUpdate(
      { _id: collectionId },
      { $pull: { likes: { $in: [likId] } } },
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
