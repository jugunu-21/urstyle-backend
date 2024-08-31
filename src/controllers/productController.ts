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
export const productController = {

  productUpload: async (
    //  { context: { user } },{ body: { name, price, code,id,image,description,link } }: IContextandBodyRequest<IUserRequest,ProductPayload>,
    req: IContextandBodyRequest<IUserRequestwithid, ProductPayload>,
    res: Response
  ) => {
    // console.log("control")

    const session = await startSession();
    session.startTransaction()
    try {
      const { user } = req.context;
      const { name, price, code, pid, description, link, image } = req.body;
      // const productId = req.params.id;
      const files = req.files as Express.Multer.File[];
      if (files['0']) {
        const file = files['0'];
        uploadCloudinary(file.path)
          .then((async response => {
            if (response !== undefined) {
              // console.log("imGE aLATERED1", response);
              await productService.create(
                {
                  name,
                  price,
                  code,
                  pid,
                  image_url: response,
                  description,
                  link,
                  userId: user.id,

                }

              )
              new Image(file as Express.Multer.File).deleteFile();
              return response;
            }
          }))

      }
      else {
        await productService.create(
          {
            name,
            price,
            code,
            pid,
            image_url: image,
            description,
            link,
            userId: user.id
          }

        )
      }

      // console.log("product saved in db", product)
      await session.commitTransaction()
      session.endSession()
      // const tokendata = {
      //   id: product.id
      // }
      // const accessToken = jwt.sign(tokendata, process.env.JWT_SECRET, {
      //   expiresIn: '7h'
      // })
      const response = res.status(StatusCodes.OK).json({
        // data: accessToken,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
      return response
    } catch (error) {

      // console.log(error)
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
  productFetch: async (
    req: IContextandBodyRequestforProducts<IUserRequestwithid>,
    res: Response
  ) => {
    const session = await startSession();
    session.startTransaction()
    try {
      const page = Number(req.query.page as string) || 1;
      const limit = Number(req.query.limit as string) || 6;
      const { user } = req.context;
      const id = user.id;
      const product = await productService.getProductsByUserForPagination(id, session, limit, page,);
      const simplifiedProducts = product.docs.map(product => ({
        image: product.image_url, // Assuming you want the URL of the image
        id: product.id,
        pid: product.pid,
        name: product.name,
        code: product.code,
        price: product.price,
        link: product.link,
        review: product.review,
        description: product.description
      }));
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.OK).json({
        data: { simplifiedProducts, totalDocs: product.totalDocs },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      });

    }
    catch (error) {
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
  productUpdate: async (
    req: IContextandBodyRequest<IUserRequestwithid, ProductPayload>,
    res: Response,
  ) => {
    const session = await startSession();
    session.startTransaction()
    try {
      const { name, price, code, description, link, pid, image } = req.body;
      // const productId = Number(req.params.id)
      const productId = req.params.id;
      const files = req.files as Express.Multer.File[];
      if (files['0']) {
        const file = files['0'];
        uploadCloudinary(file.path)
          .then((async response => {
            if (response !== undefined) {
              ;
              await productService.updateProductByProductId(productId, { response, name, price, description, link, code, pid, image_url: response });
              new Image(file as Express.Multer.File).deleteFile();
              return response;
            }
          }))

      }
      else {
        await productService.updateProductByProductId(productId, { name, price, description, link, code, pid, image_url: image });
      }




      console.log("Product is updated successfully");
      await session.commitTransaction()
      session.endSession()
      return res.status(StatusCodes.OK).json({
        data: "product updated",
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      });

    } catch (error) {
      console.log('Error updating product:', error);
      winston.error(error);
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

  productDelete: async (
    req: IContextandBodyRequest<IUserRequestwithid, ProductPayload>,
    res: Response,
  ) => {
    const session = await startSession();
    try {
      const { user } = req.context
      const id = req.params.id;
      if (!id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      // Verify JWT token

      await productService.deleteById(id, session)
      session.endSession()
      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        Status: StatusCodes.OK
      })
    }
    catch (error) {

      console.log('Error while deleting the  product:', error);
      winston.error(error);

      // Handle transaction rollback if needed
      if (session.inTransaction()) {
        await session.abortTransaction();
        session.endSession();
      }

      // Send error response
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      });
      // Handle the error appropriately, e.g., by returning an error response
    }

  }



}
