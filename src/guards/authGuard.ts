import { NextFunction, Response } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import { IContextRequest, IUserRequest } from '@/contracts/request'

export const authGuard = {
  isAuth: (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response,
    next: NextFunction
  ) => {
    if (user) {
      // console.log("user is accessiblein authguard",user)
      // console.log('user is logged in')
      return next()
    }
    console.log('no user')
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: ReasonPhrases.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED
    })
  },

  isGuest: (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response,
    next: NextFunction
  ) => {
    if (!user) {
      // console.log("user is a guest")
      return next()
    }

    return res.status(StatusCodes.FORBIDDEN).json({
      message: ReasonPhrases.FORBIDDEN,
      status: StatusCodes.FORBIDDEN
    })
  }
}

// isVerified: (
//   {
//     context: {
//       user: { verified }
//     }
//   }: IContextRequest<IUserRequest>,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (verified) {
//     return next()
//   }

//   return res.status(StatusCodes.FORBIDDEN).json({
//     message: ReasonPhrases.FORBIDDEN,
//     status: StatusCodes.FORBIDDEN
//   })
// },

// isUnverfied: (
//   {
//     context: {
//       user: { verified }
//     }
//   }: IContextRequest<IUserRequest>,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (!verified) {
//     return next()
//   }

//   return res.status(StatusCodes.FORBIDDEN).json({
//     message: ReasonPhrases.FORBIDDEN,
//     status: StatusCodes.FORBIDDEN
//   })
// }
