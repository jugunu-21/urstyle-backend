import { join } from 'path'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import { uploadMultipleImages } from '@/infrastructure/upload'

import { uploadCloudinary } from '@/utils/cloudinary'
import { cloudUrlId } from '@/utils/paths'
import { Image, Images } from '@/infrastructure/image'
// export const uploadSingleImageMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {

//     uploadSingleImage(req, res, err => {
//       const file = req.file as Express.Multer.File;
//       console.log("filee", file)
//       if (err || !file) {
//         console.log("errrorss")
//         return res.status(StatusCodes.BAD_REQUEST).json({
//           message: ReasonPhrases.BAD_REQUEST,
//           status: StatusCodes.BAD_REQUEST
//         })
//       }
//       console.log("hhh")
//       Object.assign(req, {
//         file: {
//           ...file,
//           destination: process.env.STORAGE_PATH,
//           path: join(process.env.STORAGE_PATH, file.filename)
//         }
//       })
//       console.log("object", req.file)


//       return next()
//     })
//   } catch (error) {

//     console.log("hhheee")
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       message: ReasonPhrases.BAD_REQUEST,
//       status: StatusCodes.BAD_REQUEST
//     })
//   }
// }

export const ImageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("heyy")
    uploadMultipleImages(req, res, async err => {
      const files = req.files as Express.Multer.File[];
      if (err || !files) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }
      Object.assign(req, {
        file: {
          ...files,
          destination: process.env.STORAGE_PATH,
          paths: files.map(file => join(process.env.STORAGE_PATH, file.filename))

        }
      })
      console.log("heyyuu", req.file)
      // const pathsUrl = files.map(async (file) =>{
      //   console.log("file",file)
      //   const url = await uploadCloudinary(file.path)
      //   console.log("url",url)
      //   await new Image(file as Express.Multer.File).deleteFile()
      //   return url
      // }
      // );
      // if(files['0']){
      //   const file=files['0']
      //   const url = await uploadCloudinary(file.path)
      //   req.body.image=url
      //   await new Image(file as Express.Multer.File).deleteFile()

      //   return next()
      // }
      return next()
    })
  } catch (error) {
    console.log("hhheee")
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ReasonPhrases.BAD_REQUEST,
      status: StatusCodes.BAD_REQUEST
    })
  }
}

