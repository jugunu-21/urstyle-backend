import { Response, Request } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'
import { startSession } from 'mongoose'
// import { productService } from '@/services'
import { Image } from '@/infrastructure/image'

import { appUrl, joinRelativeToMainPath } from '@/utils/paths'
import { productService, collectionService } from '@/services'
import { ProductPayload } from '../contracts/product'
import jwt from 'jsonwebtoken'
import { Params } from 'express-serve-static-core'
// import { ObjectId } from 'mongoose';
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

import { CollectionPayload } from '@/contracts/collection'
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
      const { name, description, Ids } = req.body;

      console.log("input2", user.id)
      console.log("Ids", Ids)
      const collection = await collectionService.create(
        {
          name,
          description,
          Ids,
          userId: user.id
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
        expiresIn: '7h'
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
    res: Response
  ) => {
    const session = await startSession();
    session.startTransaction();
    try {
      const { user } = req.context;
      const id = user.id;
      const collections = await collectionService.getCollectionByUser(id, session);
  
      const transformedCollectionProducts: Array<{ image: string; id: any; pid: number; name: string; code: string; price: string; link: string; review: string[]; description: string | undefined }> = [];
      const TransfomedCollections: Array<{ name: string;collectionId:string, description: string; products: typeof transformedCollectionProducts }> = [];
  
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
  
        const simplifiedCollection = {
          name: collection.name,
          description: collection.description,
          products: transformedCollectionProductsNew,
          collectionId:collection.id
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
  
      console.log("response", response);
      console.log("productfetch success");
  
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