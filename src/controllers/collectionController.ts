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
      const { name, description, Ids, category } = req.body;

      console.log("input2", user.id)
      console.log("Ids", Ids)
      const collection = await collectionService.create(
        {
          name,
          description,
          Ids,
          userId: user.id,
          category
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
      const catgeoryquery = (req.query.categoryQuery as string);
      const likedQuery = (req.query.likedQuery as string);
      const LIKED="user"
      if(likedQuery === LIKED){
        console.log("likedQuery",likedQuery)
        console.log("catgeoryquery",catgeoryquery)
        return next()
      }
      console.log("likedQueryyyyyyyy",likedQuery)
      console.log("catgeoryqueryyyyyyyyy",catgeoryquery)
      let collections;
      if (!catgeoryquery) {
        collections = await collectionService.getCollection(session);
      } else {
        collections = await collectionService.getCollectionByQuery(catgeoryquery, session);
      }
      const likeInitial: Array<ILike> = [];
      const transformedCollectionProducts: Array<{ image: string; id: any; pid: number; name: string; code: string; price: string; link: string; review: string[]; description: string | undefined }> = [];
      const TransfomedCollections: Array<{ likestatus?: boolean, name: string; collectionId: string, description: string; products: typeof transformedCollectionProducts }> = [];
      for (const collection of collections) {
        const transformedCollectionProductsNew: Array<{ image: string; id: any; pid: number; name: string; code: string; price: string; link: string; review: string[]; description: string | undefined }> = [];
        for (const id of collection.Ids) {
          const product = await productService.getByIdWithString(id);
          if (product) {
            const simplifiedProduct = {
              image: product.image_url,
              id: product.id,
              pid: product.pid,
              name: product.name,
              code: product.code,
              price: product.price,
              link: product.link,
              review: Array.isArray(product.review) ? product.review : [],
              description: product.description
            };

            transformedCollectionProductsNew.push(simplifiedProduct);
          }
        }

        // const exsistedLike = await likeandUnlikeService.likeByUserIdCollectionId({ userId: id, collectionId: collection?.id })
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
      const transformedCollectionProducts: Array<{ image: string; id: any; pid: number; name: string; code: string; price: string; link: string; review: string[]; description: string | undefined }> = [];
      const TransfomedCollections: Array<{ likestatus?: boolean, name: string; collectionId: string, description: string; products: typeof transformedCollectionProducts }> = [];
      for (const collection of collections) {
        const transformedCollectionProductsNew: Array<{ image: string; id: any; pid: number; name: string; code: string; price: string; link: string; review: string[]; description: string | undefined }> = [];
        for (const id of collection.Ids) {
          const product = await productService.getByIdWithString(id);
          if (product) {
            const simplifiedProduct = {
              image: product.image_url,
              id: product.id,
              pid: product.pid,
              name: product.name,
              code: product.code,
              price: product.price,
              link: product.link,
              review: Array.isArray(product.review) ? product.review : [],
              description: product.description
            };

            transformedCollectionProductsNew.push(simplifiedProduct);
          }
        }

        // const exsistedLike = await likeandUnlikeService.likeByUserIdCollectionId({ userId: id, collectionId: collection?.id })
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

        // console.log("simplifiedCollection", simplifiedCollection);
        TransfomedCollections.push(simplifiedCollection);
      }
      await session.commitTransaction();
      session.endSession();
      // console.log("TransfomedCollections",TransfomedCollections);

      const response = {
        data: TransfomedCollections,
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