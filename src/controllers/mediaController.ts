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
import fs from 'fs';
import { uploadCloudinary } from '../utils/cloudinary'
import { uploadFileToCloudinary } from '../utils/cloudinary'
import multer from 'multer'
import { CollectionPayload } from '@/contracts/collection'
export const mediaController = {
  imageUpload: async (
    { file }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      // const filePath = 'storage/public/your-file-name.png'; // Adjust the path according to your storage configuration
      const filepath = file?.path
      if (filepath) {
        const path = joinRelativeToMainPath(filepath)
        const fileBuffer = fs.readFileSync(path)
        const url = await uploadFileToCloudinary(fileBuffer)
        // console.log("url", url)
        const media = await mediaService.create(file as Express.Multer.File)
        // console.log('media', media)
        await new Image(file as Express.Multer.File).deleteFile()
        return res.status(StatusCodes.OK).json({
          data: { url: url },
          message: ReasonPhrases.OK,
          status: StatusCodes.OK
        })
      }
      await new Image(file as Express.Multer.File).deleteFile()
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    } catch (error) {
      // console.log("errorlast")
      winston.error(error)

      await new Image(file as Express.Multer.File).deleteFile()

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

}
