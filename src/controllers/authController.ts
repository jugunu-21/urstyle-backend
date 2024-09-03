import { Response } from 'express'
import { startSession } from 'mongoose'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'
import { checkPhoneNumber } from '@/authutils'
import { ExpiresInDays } from '@/constants'
import {
  NewPasswordPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload
} from '@/contracts/auth'
import {
  resetPasswordService,
  verificationService,
  userService
} from '@/services'
// import { jwtSign } from '@/utils/jwt'
import jwt from 'jsonwebtoken'
import {
  IBodyRequest,
  ICombinedRequest,
  IContextRequest,
  IUserRequest
} from '@/contracts/request'
import { createCryptoString } from '@/utils/cryptoString'
import { createDateAddDaysFromNow } from '@/utils/dates'
import { UserMail } from '@/mailer'
import { createHash } from '@/utils/hash'
import { redis } from '@/dataSources'
// import Cookies from 'js-cookie';

export const authController = {
  signIn: async (
    { body: { phone_number } }: IBodyRequest<SignInPayload>,
    res: Response
  ) => {
    try {
      console.log("user")
      const userbyphonenumber = await userService.getByphone_number(
        phone_number
      ) 
    
      if (!userbyphonenumber) {
        console.log("error")
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          status: StatusCodes.NOT_FOUND
        })
      }
      const tokendata = {
        id: userbyphonenumber.id
      }
      const accessToken = jwt.sign(tokendata, process.env.JWT_SECRET, {
        expiresIn: '48h'
      })
      const response = res.status(StatusCodes.OK).json({
        data: accessToken,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
      return response
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  signUp: async (
    { body: { phone_number } }: IBodyRequest<SignUpPayload>,
    res: Response
  ) => {
    // console.log('hheeeeoo', { email, password, phone_number })
    const session = await startSession()
    // console.log("heehehe",session)
    try {
      // const isUserExistbyemail = await userService.isExistByEmail(email)
      const isUserExistbyphonenumber = await userService.isExistByphone_number(
        phone_number
      )
      if (isUserExistbyphonenumber) {
        return res.status(StatusCodes.CONFLICT).json({
          message: ReasonPhrases.CONFLICT,
          status: StatusCodes.CONFLICT
        })
      }

      // const phoneNumber = `+${phone_number}`;

      // // Replace with the phone number you want to check
      // const isAssociated = await checkPhoneNumber(phoneNumber);
      //  if (!isAssociated) {
      //   return res.status(StatusCodes.CONFLICT).json({
      //   message: 'The phone number is not  associated with a user account.',
      //   status: StatusCodes.CONFLICT
      //   });
      // }
      // console.log(isAssociated,"is associated ")

      session.startTransaction()
      // const genotp = Math.floor(100000 + Math.random() * 900000).toString();
      // const hashedPassword = await createHash(password)
      const user = await userService.create(
        {
          // email,
          // password: hashedPassword,
          phone_number
          // otp: genotp,
        },
        session
      )

      const cryptoString = createCryptoString()

      const dateFromNow = createDateAddDaysFromNow(ExpiresInDays.Verification)

      const verification = await verificationService.create(
        {
          userId: user.id,
          // email,
          accessToken: cryptoString,
          expiresIn: dateFromNow
        },
        session
      )

      await userService.addVerificationToUser(
        {
          userId: user.id,
          verificationId: verification.id
        },
        session
      )
      const tokendata = {
        id: user.id
      }
      const accessToken = jwt.sign(tokendata, process.env.JWT_SECRET, {
        expiresIn: '48h'
      })

      // const userMail = new UserMail()

      // userMail.signUp({
      //   email: user.email
      // })

      // userMail.verification({
      //   email: user.email,
      //   accessToken: cryptoString
      // })

      await session.commitTransaction()
      session.endSession()
      const response = res.status(StatusCodes.OK).json({
        data: accessToken,
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })

      // res.cookie('accessToken', accessToken, {
      //   domain: 'localhost',
      //   httpOnly: true,
      //   sameSite: 'none',
      //   secure: false
      // })

      return response
    } catch (error)
    {
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

  signOut: async (
    { context: { user, accessToken } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    try {
      await redis.client.set(`expiredToken:${accessToken}`, `${user.id}`, {
        EX: process.env.REDIS_TOKEN_EXPIRATION,
        NX: true
      })

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },

  // resetPassword: async (
  //   { body: { email } }: IBodyRequest<ResetPasswordPayload>,
  //   res: Response
  // ) => {
  //   const session = await startSession()

  //   try {
  //     const user = await userService.getByEmail(email)

  //     if (!user) {
  //       return res.status(StatusCodes.OK).json({
  //         message: ReasonPhrases.OK,
  //         status: StatusCodes.OK
  //       })
  //     }

  //     session.startTransaction()

  //     const cryptoString = createCryptoString()

  //     const dateFromNow = createDateAddDaysFromNow(ExpiresInDays.ResetPassword)

  //     const resetPassword = await resetPasswordService.create(
  //       {
  //         userId: user.id,
  //         accessToken: cryptoString,
  //         expiresIn: dateFromNow
  //       },
  //       session
  //     )

  //     await userService.addResetPasswordToUser(
  //       {
  //         userId: user.id,
  //         resetPasswordId: resetPassword.id
  //       },
  //       session
  //     )

  //     const userMail = new UserMail()

  //     userMail.resetPassword({
  //       email: user.email,
  //       accessToken: cryptoString
  //     })

  //     await session.commitTransaction()
  //     session.endSession()

  //     return res.status(StatusCodes.OK).json({
  //       message: ReasonPhrases.OK,
  //       status: StatusCodes.OK
  //     })
  //   } catch (error) {
  //     winston.error(error)

  //     if (session.inTransaction()) {
  //       await session.abortTransaction()
  //       session.endSession()
  //     }
  //     return res.status(StatusCodes.BAD_REQUEST).json({
  //       message: ReasonPhrases.BAD_REQUEST,
  //       status: StatusCodes.BAD_REQUEST
  //     })
  //   }
  // },

  // newPassword: async (
  //   {
  //     body: { password },
  //     params
  //   }: ICombinedRequest<null, NewPasswordPayload, { accessToken: string }>,
  //   res: Response
  // ) => {
  //   const session = await startSession()
  //   try {
  //     const resetPassword = await resetPasswordService.getByValidAccessToken(
  //       params.accessToken
  //     )

  //     if (!resetPassword) {
  //       return res.status(StatusCodes.FORBIDDEN).json({
  //         message: ReasonPhrases.FORBIDDEN,
  //         status: StatusCodes.FORBIDDEN
  //       })
  //     }

  //     const user = await userService.getById(resetPassword.user)

  //     if (!user) {
  //       return res.status(StatusCodes.NOT_FOUND).json({
  //         message: ReasonPhrases.NOT_FOUND,
  //         status: StatusCodes.NOT_FOUND
  //       })
  //     }

  //     session.startTransaction()
  //     const hashedPassword = await createHash(password)

  //     await userService.updatePasswordByUserId(
  //       resetPassword.user,
  //       hashedPassword,
  //       session
  //     )

  //     await resetPasswordService.deleteManyByUserId(user.id, session)

  //     const { accessToken } = jwtSign(user.id)

  //     const userMail = new UserMail()

  //     userMail.successfullyUpdatedPassword({
  //       email: user.email
  //     })

  //     await session.commitTransaction()
  //     session.endSession()

  //     return res.status(StatusCodes.OK).json({
  //       data: { accessToken },
  //       message: ReasonPhrases.OK,
  //       status: StatusCodes.OK
  //     })
  //   } catch (error) {
  //     winston.error(error)

  //     if (session.inTransaction()) {
  //       await session.abortTransaction()
  //       session.endSession()
  //     }

  //     return res.status(StatusCodes.BAD_REQUEST).json({
  //       message: ReasonPhrases.BAD_REQUEST,
  //       status: StatusCodes.BAD_REQUEST
  //     })
  //   }
  // }
}
