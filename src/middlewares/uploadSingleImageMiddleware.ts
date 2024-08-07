import { join } from 'path'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import { uploadSingleImage,uploadMultipleImages } from '@/infrastructure/upload'

export const uploadSingleImageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  
    uploadSingleImage(req, res, err => 
      {
      const file = req.file as Express.Multer.File;
      if (err ||! file) {
        console.log("errror")
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }
      console.log("hhh")
      Object.assign(req, {
        file: {
          ...file,
          destination: process.env.STORAGE_PATH,
          path: join(process.env.STORAGE_PATH, file.filename)
        }
      })
      console.log("object",req.file )
      console.log("h")
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

export const uploadMultipleImageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
      console.log("errror")
      uploadMultipleImages(req, res, err => 
        
        {
          const files = req.files as Express.Multer.File[];
        if (err || !files) {
          console.log("errror")
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: ReasonPhrases.BAD_REQUEST,
            status: StatusCodes.BAD_REQUEST
          })
        }
        console.log("hhh")
        // const files = req.files as Express.Multer.File[];
        Object.assign(req, {
          file: {
            ...files,
            destination: process.env.STORAGE_PATH,
            paths: files.map(file => join(process.env.STORAGE_PATH, file.filename))

          }
        })
        console.log("object",req.file )
        console.log("h")
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

