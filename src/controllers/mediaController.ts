import { Response, Request } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'
import { startSession } from 'mongoose'
import { mediaService } from '@/services'
import { Image } from '@/infrastructure/image'

import { appUrl,joinRelativeToMainPath } from '@/utils/paths'
import { productService } from '@/services'
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
import fs from 'fs';
import cloudinary from '../utils/cloudinary'
import { jwtVerify } from '@/utils/jwt'
import path from 'path';
import { uploadFileToCloudinary } from '../utils/cloudinary'
export const mediaController = {
  imageUpload: async (
    { file }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      // const filePath = 'storage/public/your-file-name.png'; // Adjust the path according to your storage configuration
      const filepath = file?.path
      if (filepath) {
        const path=joinRelativeToMainPath(filepath)
        const fileBuffer = fs.readFileSync(path)
        const url =  await uploadFileToCloudinary(fileBuffer)
        console.log("url", url)
        const media = await mediaService.create(file as Express.Multer.File)
        console.log('media', media)
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
      console.log("errorlast")
      winston.error(error)

      await new Image(file as Express.Multer.File).deleteFile()

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },
  productUpload: async (
    //  { context: { user } },{ body: { name, price, code,id,image,description,link } }: IContextandBodyRequest<IUserRequest,ProductPayload>,
    request: IContextandBodyRequest<IUserRequestwithid, ProductPayload>,

    res: Response
  ) => {
    const { user } = request.context;
    const { name, price, code, pid, image, description, link } = request.body;
    const session = await startSession()
    try {

      session.startTransaction()
      // Your Buffer object
      // const filePathString = image.toString('utf8');
      // console.log(name,"name")
      console.log(user, "user")
      // console.log(user.id,"userid")
      // const images = 
      // const cloudresult = await cloudinary.uploader.upload(
      //   image.toString('base64'),
      //   {
      //     resource_type: "auto",
      //     // Add other necessary options here
      //   }
      // );
      const product = await productService.create(
        {
          name,
          price,
          code,
          pid,
          image_url: image,
          description,
          link,
          userId: user.id

        },
        session
      )
      console.log("product saved in db", product)
      await session.commitTransaction()
      session.endSession()
      const tokendata = {
        id: product.id
      }
      const accessToken = jwt.sign(tokendata, process.env.JWT_SECRET, {
        expiresIn: '1h'
      })

      const response = res.status(StatusCodes.OK).json({
        data: accessToken,
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
  },
  productFetch: async (
    req: IContextandBodyRequestforProducts<IUserRequestwithid>,
    res: Response

  ) => {
    try {
      const session = await startSession();
      const { user } = req.context;
      const id = user.id;
      const products = await productService.getproductsbyuser(id, session);
      const simplifiedProducts = products.map(product => ({
        image: product.image_url.url, // Assuming you want the URL of the image
        id: product.id,
        pid: product.pid,
        name: product.name,
        code: product.code,
        price: product.price,
        link: product.link,
        review: product.review,
        description: product.description
      }));
      console.log("products", products)
      return res.status(StatusCodes.OK).json({
        data: simplifiedProducts,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      });

    }
    catch (error) {




    }

  },
  productUpdate: async (
    req: IContextandBodyRequest<IUserRequestwithid, ProductPayload>,
    res: Response,
  ) => {
    const session = await startSession();
    session.startTransaction()
    try {
      const { user } = req.context;
      const { name, price, code, description, link, pid } = req.body;


      // Now use Schema.Types.ObjectId when you need to create an ObjectId instance
      // const id = new Schema.Types.ObjectId(req.params.id);
      // const id = new mongoose.Types.ObjectId(req.params.id);
      const productId = req.params.id;
      // Validate accessToken
      // if (!id) {
      //   return res.status(401).json({ message: 'Unauthorized' });
      // }
      // const { id } = jwtVerify({ accessToken });
      // if (!id) {
      //   return res.status(401).json({ message: 'Invalid token' });
      // }

      // Update product
      // const id = new mongoose.ObjectId(idd);
      await productService.updateProductByProductId(productId, { name, price, description, link, code, pid });

      // Log success
      console.log("Product is updated successfully");
      await session.commitTransaction()
      session.endSession()
      // Send successful response
      return res.status(StatusCodes.OK).json({
        data: "product upldated",
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      });

    } catch (error) {
      console.log('Error updating product:', error);
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
    }
  },
  // productImageUpdate: async (
  //   req: IContextandBodyRequest<IUserRequestwithid, ProductPayload>,
  //   res: Response,
  // ) => {
  //   const session = await startSession();
  //   session.startTransaction()
  //   try {
  //     const { user } = req.context;
  //     const { image } = req.body;
  //     const id = req.params.id;
  //     // Validate accessToken
  //     if (!id) {
  //       return res.status(401).json({ message: 'Unauthorized' });
  //     }

  //     interface ImageUrl {
  //       public_id: string;
  //       url: string;
  //     }

  //     let image_url: ImageUrl
  //     console.log("about to store data on cloudinary")
  //     const cloudresult = await cloudinary.uploader.upload(
  //       image.toString('base64'),
  //       {
  //         resource_type: "auto",
  //         // Add other necessary options here
  //       }
  //     );
  //     console.log("clouderesult", cloudresult.public_id)
  //     console.log("clouderesult", cloudresult.secure_url)
  //     // Construct the image_url object with the result from Cloudinary
  //     image_url = {
  //       public_id: cloudresult.public_id,
  //       url: cloudresult.secure_url
  //     };
  //     // Update the product with the new image_url
  //     console.log("uploaddedd to cloudinary")

  //     await productService.updateProductImageByProductId(id, { image_url });

  //     console.log("ProductImage  is updated successfully");
  //     session.endSession()
  //     // Send successful response
  //     return res.status(StatusCodes.OK).json({
  //       message: ReasonPhrases.OK,
  //       status: StatusCodes.OK
  //     });
  //   } catch (error) {
  //     console.error('Failed to upload image to Cloudinary:', error);
  //     console.log('Error updating product:', error);
  //     winston.error(error);

  //     // Handle transaction rollback if needed
  //     if (session.inTransaction()) {
  //       await session.abortTransaction();
  //       session.endSession();
  //     }

  //     // Send error response
  //     return res.status(StatusCodes.BAD_REQUEST).json({
  //       message: ReasonPhrases.BAD_REQUEST,
  //       status: StatusCodes.BAD_REQUEST
  //     });
  //     // Handle the error appropriately, e.g., by returning an error response
  //   }

  //   // Update product
  //   // Log success


  // },
  productDelete:
    async (
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
