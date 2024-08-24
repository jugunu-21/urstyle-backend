import { Response, Request } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'
import { startSession } from 'mongoose'
import { mediaService } from '@/services'
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


}
