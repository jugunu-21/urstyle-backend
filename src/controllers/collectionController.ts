import { NextFunction, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'
import { startSession } from 'mongoose'
import { Image } from '@/infrastructure/image'
import { Collection } from '@/models/collection';
import { Like } from '@/models/like';
import { Dislike } from '@/models/dislike';
import { appUrl, joinRelativeToMainPath } from '@/utils/paths'
import { productService, collectionService, likeandUnlikeService, userService } from '@/services'
import { ProductPayload } from '../contracts/product'
import jwt from 'jsonwebtoken'
import { Params } from 'express-serve-static-core'
import { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { Types } from 'mongoose';
import {
  IProductBodyRequestRaw,
  IContextandBodyRequest,
  IBodyRequest,
  ICombinedRequest,
  IContextRequest,
  IUserRequest,
  IParamsRequest,
  IUserRequestwithid,
  IContextandBodyRequestforProducts
} from '@/contracts/request'
import { ILike } from '@/contracts/like'
import { CollectionPayload } from '@/contracts/collection'
import { stringify } from 'querystring'
import { error } from 'console'
export const collectionController = {

  collectionUpload: async (
    req: IContextandBodyRequest<IUserRequestwithid, CollectionPayload>,
    res: Response
  ) => {
    console.log("collectionUpload")
    const session = await startSession();
    session.startTransaction()
    try {
      const { user } = req.context;
      console.log("input", user.id)
      const { name, description, Ids, collectionCategory } = req.body;

      console.log("input2", user.id)
      console.log("Ids", Ids)
      const collection = await collectionService.create(
        {
          name,
          description,
          Ids,
          userId: user.id,
          collectionCategory
        },
        session
      )
      console.log("collection", collection)
      await session.commitTransaction()
      session.endSession()
      const tokendata = {
        id: collection.id
      }
      const accessToken = jwt.sign(tokendata, process.env.JWT_SECRET, {
        expiresIn: '48h'
      })

      const response = res.status(StatusCodes.OK).json({
        data: accessToken,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })

      return response
    } catch (error) {
      winston.error(error)
      if (session.inTransaction()) {
        await session.abortTransaction()
        session.endSession()
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },
  collectionFetch: async (
    req: IContextandBodyRequest<IUserRequestwithid, CollectionPayload>,
    res: Response,
    next: NextFunction
  ) => {
    const session = await startSession();
    session.startTransaction();
    const { user } = req.context;
    try {
      const catgeoryQuery = (req.query.categoryQuery as string);
      const likedQuery = (req.query.likedQuery as string);
      const LIKED = "likedCollection"
      if (likedQuery === LIKED) {
        return next()
      }
      let collections;
      if (!catgeoryQuery) {
        collections = await collectionService.getCollection(session);
      } else {
        collections = await collectionService.getCollectionByQuery(catgeoryQuery, session);
      }
      const transformedCollectionProducts: Array<{ image: string; webLink: string; id: any; category: string; name: string; subCategory: string; price: string; link: string; review: string[]; description: string | undefined }> = [];
      const TransfomedCollections: Array<{ likestatus?: boolean, name: string; collectionId: string, description: string; products: typeof transformedCollectionProducts }> = [];
      for (const collection of collections) {
        const transformedCollectionProductsNew: Array<{ image: string; id: any; category: string; name: string; subCategory: string; webLink: string; price: string; link: string; review: string[]; description: string | undefined }> = [];
        for (const id of collection.Ids) {
          const product = await productService.getByIdWithString(id);
          if (product) {
            const simplifiedProduct = {
              image: product.image_url,
              id: product.id,
              category: product.category,
              name: product.name,
              webLink: product.webLink,
              subCategory: product.subCategory,
              price: product.price,
              link: product.link,
              review: Array.isArray(product.review) ? product.review : [],
              description: product.description
            };
            transformedCollectionProductsNew.push(simplifiedProduct);
          }
        }
        const existsLike = user ? (
          await likeandUnlikeService.IslikeByUserIdCollectionIdExsist({
            userId: user.id,
            collectionId: collection?.id
          })
        ) : null;
        const simplifiedCollection = {
          name: collection.name,
          description: collection.description,
          products: transformedCollectionProductsNew,
          collectionId: collection.id,
          ...(existsLike != null && { likestatus: existsLike })
        };
        TransfomedCollections.push(simplifiedCollection);
      }
      await session.commitTransaction();
      session.endSession();
      const response = {
        data: TransfomedCollections,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      };
      // console.log("response", response)
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
        session.endSession();
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      });
    }
  },
  LikedCollectionFetch: async (
    req: IContextandBodyRequest<IUserRequestwithid, CollectionPayload>,
    res: Response
  ) => {
    const session = await startSession();
    session.startTransaction();
    const { user } = req.context;
    let collectionIds: object[] = []
    if (user.likes) {
      const havecollectionsIds = await likeandUnlikeService.getCollectionsIdsFromLikeId({ likes: user.likes })
      collectionIds = havecollectionsIds.map(item => item.collectionId);

    }
    try {
      const collections = await collectionService.getCollectionByCollectiIds({ collectionIds, session });

      const transformedCollectionProducts: Array<{ image: string; id: any; category: string; name: string; webLink: string; subCategory: string; price: string; link: string; review: string[]; description: string | undefined }> = [];
      const TransfomedCollections: Array<{ likestatus?: boolean, name: string; collectionId: string, description: string; products: typeof transformedCollectionProducts }> = [];
      for (const collection of collections) {
        const transformedCollectionProductsNew: Array<{ image: string; webLink: string; id: any; category: string; name: string; subCategory: string; price: string; link: string; review: string[]; description: string | undefined }> = [];
        for (const id of collection.Ids) {
          const product = await productService.getByIdWithString(id);
          if (product) {
            const simplifiedProduct = {
              image: product.image_url,
              id: product.id,
              category: product.category,
              name: product.name,
              subCategory: product.subCategory,
              price: product.price,
              webLink: product.webLink,
              link: product.link,
              review: Array.isArray(product.review) ? product.review : [],
              description: product.description
            };

            transformedCollectionProductsNew.push(simplifiedProduct);
          }
        }
        const existsLike = user ? (
          await likeandUnlikeService.IslikeByUserIdCollectionIdExsist({
            userId: user.id,
            collectionId: collection?.id
          })
        ) : null;
        const simplifiedCollection = {
          name: collection.name,
          description: collection.description,
          products: transformedCollectionProductsNew,
          collectionId: collection.id,
          ...(existsLike != null && { likestatus: existsLike })
        };
        TransfomedCollections.push(simplifiedCollection);
      }
      await session.commitTransaction();
      session.endSession();
      const response = {
        data: TransfomedCollections,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      };
      console.log("responserrrrrttrt", response)
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
        session.endSession();
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      });
    }
  },
  collectionbyColletionId: async (
    req: IContextandBodyRequest<IUserRequestwithid, CollectionPayload>,
    res: Response
  ) => {
    const session = await startSession();
    session.startTransaction();
    const collectionId = req.params.collectionId;
    try {
      const collection = await collectionService.getCollectioById(collectionId, session);
      const transformedCollectionProductsNew: Array<{ image: string; id: any; category: string; name: string; webLink: string; subCategory: string; price: string; link: string; review: string[]; description: string | undefined }> = [];
      if (collection?.Ids) {
        for (const id of collection?.Ids) {
          const product = await productService.getByIdWithString(id);

          if (product) {
            const simplifiedProduct = {
              image: product.image_url,
              id: product.id,
              category: product.category,
              name: product.name,
              subCategory: product.subCategory,
              price: product.price,
              webLink: product.webLink,
              link: product.link,
              review: Array.isArray(product.review) ? product.review : [],
              description: product.description
            };
            transformedCollectionProductsNew.push(simplifiedProduct);
          }
        }
      } else {
        console.warn('error');
      }

      const simplifiedCollection = {
        name: collection?.name,
        description: collection?.description,
        products: transformedCollectionProductsNew,
        collectionId: collection?.id,
      };
      await session.commitTransaction();
      session.endSession();
      const response = {
        data: simplifiedCollection,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      };
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
        session.endSession();
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      });
    }
  },
  deletecollection: async (
    req: IContextandBodyRequest<IUserRequestwithid, CollectionPayload>,
    res: Response
  ) => {
    const session = await startSession();
    session.startTransaction();
    const collectionId = req.params.collectionId;
    try {
      console.log("responsesucessfull")
      await collectionService.deleteCollectioById(collectionId, session);
      await session.commitTransaction();
      session.endSession();
      const response = {
        data: "sucessfully deletec colletion",
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      };
      console.log("responsesucessfull")
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
        session.endSession();
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      });
    }
  },

  collectionUpdate: async (
    req: IContextandBodyRequest<IUserRequestwithid, CollectionPayload>,
    res: Response
  ) => {

    console.log("collectionUpload")
    const session = await startSession();
    session.startTransaction()
    try {
      const collectionId = req.params.collectionId;
      const { user } = req.context
      const userId = user.id
      const { name, description, Ids, collectionCategory } = req.body;
      const collection = await collectionService.updateCollection(
        {
          name,
          description,
          Ids,
          userId,
          collectionCategory,
          collectionId,
          session
        },

      )
      console.log("collection", collection)
      await session.commitTransaction()
      session.endSession()


      const response = res.status(StatusCodes.OK).json({
        data: "collection updated",
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })

      return response
    } catch (error) {
      winston.error(error)
      if (session.inTransaction()) {
        await session.abortTransaction()
        session.endSession()
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },
  collectionbyUserId: async (
    req: IContextandBodyRequest<IUserRequestwithid, CollectionPayload>,
    res: Response
  ) => {
    const session = await startSession();
    session.startTransaction();
    const { user } = req.context;
    const userId = user.id;
    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 6;

    try {
      const catgeoryQuery = (req.query.categoryQuery as string);
      const likedQuery = (req.query.likedQuery as string);
      const page = Number(req.query.page as string) || 1;
      const limit = Number(req.query.limit as string) || 6;
      const { user } = req.context;
      const userId = user.id;

      const collections = await collectionService.getCollectionByUserIdforPagination(userId, limit, page, session,);

      const transformedCollectionProducts: Array<{ image: string; webLink: string; id: any; category: string; name: string; subCategory: string; price: string; link: string; review: string[]; description: string | undefined }> = [];
      const TransfomedCollections: Array<{ likestatus?: boolean, categories: string[], name: string; collectionId: string, description: string; products: typeof transformedCollectionProducts }> = [];
      for (const collection of collections.docs) {
        const transformedCollectionProductsNew: Array<{ image: string; id: any; category: string; name: string; subCategory: string; webLink: string; price: string; link: string; review: string[]; description: string | undefined }> = [];
        for (const id of collection.Ids) {
          const product = await productService.getByIdWithString(id);
          if (product) {
            const simplifiedProduct = {
              image: product.image_url,
              id: product.id,
              category: product.category,
              name: product.name,
              webLink: product.webLink,
              subCategory: product.subCategory,
              price: product.price,
              link: product.link,
              review: Array.isArray(product.review) ? product.review : [],
              description: product.description
            };
            transformedCollectionProductsNew.push(simplifiedProduct);
          }

        }
        const existsLike = user ? (
          await likeandUnlikeService.IslikeByUserIdCollectionIdExsist({
            userId: user.id,
            collectionId: collection?.id
          })
        ) : null;


        const simplifiedCollection = {
          name: collection.name,
          categories: collection.collectionCategory,
          description: collection.description,
          products: transformedCollectionProductsNew,
          collectionId: collection.id,
          ...(existsLike != null && { likestatus: existsLike })
        };
        TransfomedCollections.push(simplifiedCollection);
      }
      await session.commitTransaction();
      session.endSession();

      const response = {
        data: { simplifiedCollection: TransfomedCollections, totalDocs: collections.totalDocs },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      };
      console.log("response", response)
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
        session.endSession();
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      });
    }
  },
  collectionLikeUnlike: async (
    req: IContextandBodyRequest<IUserRequestwithid, CollectionPayload>,
    res: Response
  ) => {
    const session = await startSession();
    session.startTransaction();
    try {
      // console.log("hhh")
      const { user } = req.context;
      const id = user.id;
      const collectionId = req.params.collectionId;
      // console.log("collectionId", collectionId)
      const collection = await collectionService.getCollectioById(collectionId, session);
      const exsistedLike = await likeandUnlikeService.likeByUserIdCollectionId({ userId: id, collectionId: collection?.id })
      if (exsistedLike) {
        // console.log("EXSIST")
        await likeandUnlikeService.deleteLike({ userId: id, collectionId: collection?.id })
        await collectionService.removeLikeFromCollection(collection?.id, exsistedLike.id, session)
        await userService.removeLikeFromUser(user?.id, exsistedLike.id, session)
      } else {
        // console.log("doesnotexsist")
        const createdLike = await likeandUnlikeService.createLike({ userId: id, collectionId: collection?.id });
        await collectionService.addLikeToCollection({ collectionId: collection?.id, createdLikeId: createdLike.id })
        await userService.addLikeToUser({ userId: user?.id, createdLikeId: createdLike.id })

      }
      await session.commitTransaction();
      session.endSession();
      const response = {
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      };
      // console.log("hhh", response)
      return res.status(StatusCodes.OK).json(response);

    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
        session.endSession();
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      });
    }
  },

}