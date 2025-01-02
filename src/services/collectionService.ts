import mongoose, { ClientSession, ObjectId } from 'mongoose'
import { Collection } from '@/models'
import { error } from 'console'
import { ok } from 'assert'
import { Like } from '@/models/like'

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
  updateCollection: async ({
    name,
    Ids,
    description,
    collectionId,
    collectionCategory,
    userId,
    session,
  }:
    {

      name: string

      userId: string

      collectionId: string

      description: string

      collectionCategory: string[]

      Ids: string[]

      verified?: boolean

      session?: ClientSession

    }
  ) => {
    try {
      console.log("collectionId", collectionId)
      const collection = await Collection.findById(collectionId);

      if (!collection) {
        throw new Error('Collection not found');
      }
      const updateData = {
        name,
        Ids,
        description,
        collectionCategory,
      };

      const filter = { id: collectionId };
      const options = session ? { session } : {};

      const result = await Collection.updateOne(filter, updateData, options);

      if (result.modifiedCount === 0) {
        // Handle the case where no documents were updated
        console.warn('No documents were updated.');
      }

      return result;
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  },
  getCollectioById: async (collectionId: string, session?: ClientSession) => {
    const collection = await Collection.findById(collectionId)
    return collection
  },
  deleteCollectioById: async (collectionId: string, session?: ClientSession) => {

    try {
      const collection = await Collection.findById(collectionId)
      if (!collection) {
        throw new Error('collection not found');
      }



      return Collection.deleteOne({ _id: collectionId }, { session })

    }
    catch { error }
    console.error("doesnot exist any product with this id ")
    throw error;
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
      const collections = await Collection.find({}).session(session);
      return collections;
    } catch (error) {
      console.error('Error fetching collection by user:', error);
      throw error;
    }
  },
  getCollections: async (session: ClientSession,
    userId?: string, categoryQueryInput?: string, likedQuery?: string
  ) => {
    console.log("likedQuery", likedQuery)
    console.log("categoryQueryInput", categoryQueryInput)
    try {
      const collections = await Collection.aggregate([
        {
          $match: {
            ...(categoryQueryInput && {
              collectionCategory: { $in: [categoryQueryInput] }, // Use $in to match arrays
            }),
          },
        },
        {
          $lookup: {
            from: "likes", // The collection to join
            let: { likesIds: "$likes", inputUserId: userId }, // Extract likes array and inputUserId
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: [
                          "$_id", // The _id of the Like document
                          "$$likesIds" // Array of likeIds from the current document
                        ]
                      },
                      {
                        $eq: [
                          "$userId", // userId in the Like document
                          { $toObjectId: "$$inputUserId" } // Convert inputUserId to ObjectId if needed
                        ]
                      }
                    ]
                  }
                }
              }
            ],
            as: "userLikes" // Field to store the matching Like documents
          }
        },
        {
          $addFields: {
            likestatus: {
              $cond: {
                if: { $ne: [userId, undefined] }, // Check if userId is not null
                then: { // If userId exists, check userLikes array size
                  $cond: {
                    if: { $gt: [{ $size: "$userLikes" }, 0] }, // If userLikes is not empty
                    then: true, // Set likestatus to 1
                    else: false// Set likestatus to 0 if userLikes is empty
                  }
                },
                else: "$$REMOVE" // If userId is null, remove likestatus field
              }
            }
          }
        },

        {
          $lookup: {
            from: "products",
            let: { productIds: "$Ids" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: [
                      "$_id",
                      { $map: { input: "$$productIds", as: "id", in: { $toObjectId: "$$id" } } }
                    ]
                  }
                }
              }
            ],
            as: "products"
          }
        },
        {
          $project: {
            _id: 0,
            name: 1,
            description: 1,
            collectionId: "$_id",
            likestatus: 1,  // Includes likestatus field
            userLikes: 1,  // Includes userLikes field (optional)
            products: {
              $map: {
                input: "$products",
                as: "product",
                in: {
                  image: "$$product.image_url",
                  id: "$$product._id",
                  category: "$$product.category",
                  webLink: "$$product.webLink",
                  link: "$$product.link",
                  subCategory: "$$product.subCategory",
                  description: "$$product.description",
                  name: "$$product.name",
                  price: "$$product.price",
                  review: {
                    $cond: {
                      if: { $isArray: "$$product.review" },
                      then: "$$product.review",
                      else: []
                    }
                  }
                }
              }
            }
          }
        }
      ]).session(session);

      return collections;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  }
  ,
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
