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

import { CollectionPayload } from '@/contracts/collection'
export const productController = {

  productUpload: async (
    req: IContextandBodyRequest<IUserRequestwithid, ProductPayload>,
    res: Response
  ) => {
    // console.log("control")

    const session = await startSession();
    session.startTransaction()
    try {
      const { user } = req.context;
      const { name, price, subCategory, category, description, link, image, webLink } = req.body;
      const files = req.files as Express.Multer.File[];
      if (files['0']) {
        const file = files['0'];
        uploadCloudinary(file.path)
          .then((async response => {
            if (response !== undefined) {
              await productService.create(
                {
                  name,
                  price,
                  subCategory,
                  category,
                  image_url: response,
                  description,
                  link,
                  webLink,
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
            webLink,
            price,
            subCategory,
            category,
            image_url: image,
            description,
            link,
            userId: user.id
          }

        )
      }
      await session.commitTransaction()
      session.endSession()
      const response = res.status(StatusCodes.OK).json({
        // data: accessToken,
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
        image: product.image_url,
        id: product.id,
        category: product.category,
        name: product.name,
        subCategory: product.subCategory,
        price: product.price,
        link: product.link,
        webLink: product.webLink,
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
  productFetchById: async (
    req: IContextandBodyRequestforProducts<IUserRequestwithid>,
    res: Response
  ) => {
    const session = await startSession();
    session.startTransaction()
    try {
      const productId = req.params.productId
      const product = await productService.getByIdWithString(productId);
      const simplifiedProducts = {
        image: product?.image_url, // Assuming you want the URL of the image
        id: product?.id,
        webLink: product?.webLink,
        category: product?.category,
        name: product?.name,
        subCategory: product?.subCategory,
        price: product?.price,
        link: product?.link,
        review: product?.review,
        description: product?.description
      };
      console.log("simplifiedProducts", simplifiedProducts)
      await session.abortTransaction();
      session.endSession();
      return res.status(StatusCodes.OK).json({
        data: { simplifiedProducts },
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
      const { name, price, subCategory, description, link, webLink, category, image } = req.body;
      // const productId = Number(req.params.id)
      const productId = req.params.id;
      const files = req.files as Express.Multer.File[];
      if (files['0']) {
        const file = files['0'];
        uploadCloudinary(file.path)
          .then((async response => {
            if (response !== undefined) {
              ;
              await productService.updateProductByProductId(productId, { response, name, price, description, link, subCategory, category, webLink, image_url: response });
              new Image(file as Express.Multer.File).deleteFile();
              return response;
            }
          }))

      }
      else {
        await productService.updateProductByProductId(productId, { name, price, description, link, subCategory, webLink, category, image_url: image });
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
    req: IContextandBodyRequestforProducts<IUserRequestwithid>,
    res: Response,
  ) => {
    const session = await startSession();
    try {
      const productId = req.params.productId;
      if (!productId) {
        return res.status(401).json({ message: 'Unauthorized', status: StatusCodes.BAD_REQUEST });
      }
      console.log("idcgghbjh", productId)
      await collectionService.checkProductsInCollectionsByProductId({ productId: productId, session: session })
      await productService.deleteByProductId(productId, session)

      session.endSession()
      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    }
    catch (error) {
      console.log('Error while deleting the  product:', error);
      winston.error(error);
      if (session.inTransaction()) {
        await session.abortTransaction();
        session.endSession();
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      });
      // Handle the error appropriately, e.g., by returning an error response
    }

  }



}
