import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'
import { startSession } from 'mongoose'
import { mediaService } from '@/services'
import { Image } from '@/infrastructure/image'

import { appUrl } from '@/utils/paths'
import { productService } from '@/services'
import { ProductPayload } from '../contracts/product'
import {
  IBodyRequestRaw,
  IBodyRequest,
  ICombinedRequest,
  IContextRequest,
  IUserRequest
} from '@/contracts/request'

import cloudinary from '../utils/cloudinary'
export const mediaController = {
  imageUpload: async (
    { file }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      const media = await mediaService.create(file as Express.Multer.File)
      console.log('media', media)
      const image = appUrl(
        await new Image(media).sharp({ width: 150, height: 150 })
      )

      return res.status(StatusCodes.OK).json({
        data: { id: media.id, image },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      winston.error(error)

      await new Image(file as Express.Multer.File).deleteFile()

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },
  productUpload: async (
    { body: { name, price, code,id,image,description,link } }: IBodyRequestRaw<ProductPayload>,
    res: Response
  ) => {
    // console.log('saved in db')
    const session = await startSession()
    try {
    
      session.startTransaction()
      // Your Buffer object
// const filePathString = image.toString('utf8');
      const cloudresult = await cloudinary.uploader.upload(image)
      const product = await productService.create(
        {
          name,
          price,
          code,
          id,
          image_url: {
            public_id: cloudresult.public_id,
            url:cloudresult.secure_url
          },
          description,
          link
          
        },
        session
      )
      console.log(product)
      await session.commitTransaction()
      session.endSession()
      const response = res.status(StatusCodes.OK).json({
        // data: accessToken,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })

      return response

     
    } catch (error) {
      console.log(' error saved in db')
      console.log(error)
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
  }
}
