import mongoose, { ClientSession, ObjectId } from 'mongoose'
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
    userId?: string
  ) => {
    try {
      const collections = await Collection.aggregate([
        // Lookup for likes
        {

          $lookup: {
            from: "Like", // Lookup the 'Like' collection
            let: {
              likesIds: "$likes" // The array of Like document IDs from the collection
            },
            pipeline: [
              // {
              //   $match: {
              //     $expr: {
              //       $in: ["$_id", "$$likesIds"] // Match Likes where the _id is in the likes array from the collection
              //     }
              //   }
              // },
              {
                $match: {
                  $expr: {
                    // Match the userId in the Like document to the userId passed to the function
                    $eq: [{ $toObjectId: "$userId" }, { $toObjectId: userId }]
                  }
                }
              }
            ],
            as: "userLikes" // This will be an array of Likes where the userId matches the provided userId
          }
        },


        // Add likestatus field based on whether userLikes array is not empty (user has liked the collection)
        {
          $addFields: {
            likestatus: userId
              ? { $gt: [{ $size: "$userLikes" }, 0] } // If userLikes is not empty, likestatus is true
              : null // If userId is null, likestatus will be null
          }
        },
        // Add likestatus field
        {
          $addFields: {
            likestatus: userId
              ? { $cond: { if: { $gt: [{ $size: "$userLikes" }, 0] }, then: true, else: false } }
              : null // If userId is null, likestatus will be null or can be excluded
          }
        },

        // Lookup for products
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

        // Project the necessary fields
        {
          $project: {
            _id: 0,
            name: 1,
            description: 1,
            collectionId: "$_id",
            // likestatus: 1,  // Includes likestatus field
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
