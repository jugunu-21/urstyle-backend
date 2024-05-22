import { NextFunction, Response } from 'express'
import validator from 'validator'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'

import {
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
  NewPasswordPayload
} from '@/contracts/auth'
import { IBodyRequest } from '@/contracts/request'

export const authValidation = {
  signIn: (
    req: IBodyRequest<SignInPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // if (!req.body.email || !req.body.password || !req.body.phone_number) {
        if ( !req.body.phone_number) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }
      // let phonenumber = req.body.phone_number
     
      // let normalizedEmail =
      //   req.body.email && validator.normalizeEmail(req.body.email)
      // if (normalizedEmail) {
      //   normalizedEmail = validator.trim(normalizedEmail)
      // }

      // if (
      //   !normalizedEmail ||
      //   !validator.isEmail(normalizedEmail, { allow_utf8_local_part: false })
      // ) {
      //   return res.status(StatusCodes.BAD_REQUEST).json({
      //     message: ReasonPhrases.BAD_REQUEST,
      //     status: StatusCodes.BAD_REQUEST
      //   })
      // }

      // Object.assign(req.body, { phone_number: phonenumber })

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  signUp: (
    req: IBodyRequest<SignUpPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (
       
        !req.body.phone_number
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        });
      }
  
      // if (
      //   !req.body.email ||
      //   !req.body.password ||
      //   !validator.isLength(req.body.password, { min: 6, max: 48 }) ||
      //   !req.body.phone_number
      // ) {
      //   return res.status(StatusCodes.BAD_REQUEST).json({
      //     message: ReasonPhrases.BAD_REQUEST,
      //     status: StatusCodes.BAD_REQUEST
      //   });
      // }
   
    
      // let normalizedEmail =
      //   req.body.email && validator.normalizeEmail(req.body.email)
      //   // console.log('hurreeee',req.body.email,' ',req.body.password,' ',normalizedEmail)
      // if (normalizedEmail) {
      //   normalizedEmail = validator.trim(normalizedEmail)
      //   // console.log('hurreeee11',req.body.email,' ',req.body.password,' ',normalizedEmail)
      // } 
     
      // if (
      //   !normalizedEmail ||
      //   !validator.isEmail(normalizedEmail, { allow_utf8_local_part: false })
      // ) {
    
      //   return res.status(StatusCodes.BAD_REQUEST).json({
      //     message: ReasonPhrases.BAD_REQUEST,
      //     status: StatusCodes.BAD_REQUEST
      //   })
      // }
     
      // Object.assign(req.body, { email: normalizedEmail })
      // console.log('hurreeee4442',req.body.email,' ',req.body.password,' ',normalizedEmail)
      return next()
    } catch (error) {
   
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  resetPassword: (
    req: IBodyRequest<ResetPasswordPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.email) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }
      let normalizedEmail =
        req.body.email && validator.normalizeEmail(req.body.email)
      if (normalizedEmail) {
        normalizedEmail = validator.trim(normalizedEmail)
      }

      if (
        !normalizedEmail ||
        !validator.isEmail(normalizedEmail, { allow_utf8_local_part: false })
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      Object.assign(req.body, { email: normalizedEmail })

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  newPassword: (
    req: IBodyRequest<NewPasswordPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (
        !req.body.password ||
        !validator.isLength(req.body.password, { min: 6, max: 48 })
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
          status: StatusCodes.BAD_REQUEST
        })
      }

      return next()
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  }
}
