import { Response, Request } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import winston from 'winston'
import { startSession } from 'mongoose'
import { mediaService } from '@/services'
import { Image } from '@/infrastructure/image'

import { appUrl } from '@/utils/paths'
import { productService } from '@/services'
import { ProductPayload } from '../contracts/product'
import jwt from 'jsonwebtoken'
import { Params } from 'express-serve-static-core'
import {
  IProductBodyRequestRaw,
  IContextandBodyRequest,
  IBodyRequest,
  ICombinedRequest,
  IContextRequest,
  IUserRequest,
  IParamsRequest,
  IUserRequestwithid
} from '@/contracts/request'

import cloudinary from '../utils/cloudinary'
import { jwtVerify } from '@/utils/jwt'
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
      const cloudresult = await cloudinary.uploader.upload(
        image.toString('base64'),
        {
          resource_type: "auto",
          // Add other necessary options here
        }
      );
      const product = await productService.create(
        {
          name,
          price,
          code,
          pid,
          image_url: {
            public_id: cloudresult.public_id,
            url: cloudresult.secure_url
          },
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
  productUpdate: async (
    req: IContextandBodyRequest<IUserRequestwithid, ProductPayload>,

    res: Response,
  ) => {
    const session = await startSession();
    try {
      const { user } = req.context;
      const { name, price, code, image, description, link,pid } = req.body;
      const accessToken = req.params.productAccessToken;
  
      // Validate accessToken
      if (!accessToken) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // Verify JWT token
      const { id } = jwtVerify({ accessToken });
      if (!id) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      let image_url;
  if(image){
    const cloudresult = await cloudinary.uploader.upload(
      image.toString('base64'),
      {
        resource_type: "auto",
        // Add other necessary options here
      }
    );
     image_url= {
      public_id: cloudresult.public_id,
      url: cloudresult.secure_url
    }
   
  }

      // Update product
      await productService.updateProductByProductId(id, { name, price, description, link,code,pid });
  
      // Log success
      console.log("Product is updated successfully");
  
      // Send successful response
      return res.status(StatusCodes.OK).json({
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
  }
  

}
