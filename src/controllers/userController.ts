import { Response } from 'express'
import { ObjectId, startSession } from 'mongoose'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import winston from 'winston'

import {
  ICombinedRequest,
  IContextRequest,
  IParamsRequest,
  IUserRequest,
  IUserRequestwithId
} from '@/contracts/request'
import {
  DeleteProfilePayload,
  UpdateEmailPayload,
  UpdatePasswordPayload,
  UpdateProfilePayload,
  VerificationRequestPayload
} from '@/contracts/user'
import {
  likeandUnlikeService,
  mediaService,
  resetPasswordService,
  userService,
  verificationService
} from '@/services'
import { ExpiresInDays, MediaRefType } from '@/constants'
import { createDateAddDaysFromNow } from '@/utils/dates'
import { createCryptoString } from '@/utils/cryptoString'
import { UserMail } from '@/mailer'
import { jwtSign } from '@/utils/jwt'
import { createHash } from '@/utils/hash'
import { Image } from '@/infrastructure/image'
import { appUrl } from '@/utils/paths'

export const userController = {
  me: async (
    { context: { user } }: IContextRequest<IUserRequest>,
    res: Response
  ) => {
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({

        message: ReasonPhrases.NOT_FOUND,
        status: StatusCodes.NOT_FOUND
      })
    }
 

    const phone_number = user.phone_number
    return res.status(StatusCodes.OK).json({
      data: phone_number,
      message: ReasonPhrases.OK,
      status: StatusCodes.OK
    })
  },

  // verificationRequest: async (
  //   {
  //     context: { user },
  //     body: { email, phone_number }
  //   }: ICombinedRequest<IUserRequest, VerificationRequestPayload>,
  //   res: Response
  // ) => {
  //   const session = await startSession();

  //   try {
  //     let existingUser;

  //     if (email) {
  //       existingUser = await userService.getByEmail(email);
  //     } else if (phone_number) {
  //       // You can add logic here to retrieve user by phone number if needed
  //       // existingUser = await userService.getByPhoneNumber(phone_number);
  //     }

  //     if (existingUser) {
  //       return res.status(StatusCodes.CONFLICT).json({
  //         message: ReasonPhrases.CONFLICT,
  //         status: StatusCodes.CONFLICT
  //       });
  //     }

  //     session.startTransaction();
  //     const cryptoString = createCryptoString();
  //     const dateFromNow = createDateAddDaysFromNow(ExpiresInDays.Verification);

  //     let verification = await verificationService.findOneAndUpdateByUserIdAndEmail(
  //       {
  //         userId: user.id,
  //         email,
  //         accessToken: cryptoString,
  //         expiresIn: dateFromNow
  //       },
  //       session
  //     );

  //     if (!verification) {
  //       verification = await verificationService.create(
  //         {
  //           userId: user.id,
  //           email,
  //           accessToken: cryptoString,
  //           expiresIn: dateFromNow
  //         },
  //         session
  //       );

  //       await userService.addVerificationToUser(
  //         {
  //           userId: user.id,
  //           verificationId: verification.id
  //         },
  //         session
  //       );
  //     }

  //     const userMail = new UserMail();

  //     userMail.verification({
  //       email: email,
  //        // Use email if provided, otherwise use phone_number
  //       accessToken: cryptoString
  //     });

  //     await session.commitTransaction();
  //     session.endSession();

  //     return res.status(StatusCodes.OK).json({
  //       message: ReasonPhrases.OK,
  //       status: StatusCodes.OK
  //     });
  //   } catch (error) {
  //     winston.error(error);

  //     if (session.inTransaction()) {
  //       await session.abortTransaction();
  //       session.endSession();
  //     }

  //     return res.status(StatusCodes.BAD_REQUEST).json({
  //       message: ReasonPhrases.BAD_REQUEST,
  //       status: StatusCodes.BAD_REQUEST
  //     });
  //   }
  // },

  // verification: async (
  //   { params }: IParamsRequest<{ accessToken: string }>,
  //   res: Response
  // ) => {
  //   const session = await startSession();
  //   try {
  //     const verification = await verificationService.getByValidAccessToken(
  //       params.accessToken
  //     );

  //     if (!verification) {
  //       return res.status(StatusCodes.FORBIDDEN).json({
  //         message: ReasonPhrases.FORBIDDEN,
  //         status: StatusCodes.FORBIDDEN
  //       });
  //     }

  //     session.startTransaction();

  //     await userService.updateVerificationAndEmailByUserId(
  //       verification.user,
  //       verification.email,
  //       session
  //     );

  //     await verificationService.deleteManyByUserId(verification.user, session);

  //     const { accessToken } = jwtSign(verification.user);

  //     const userMail = new UserMail();

  //     userMail.successfullyVerified({
  //       email: verification.email
  //     });

  //     await session.commitTransaction();
  //     session.endSession();

  //     return res.status(StatusCodes.OK).json({
  //       data: { accessToken },
  //       message: ReasonPhrases.OK,
  //       status: StatusCodes.OK
  //     });
  //   } catch (error) {
  //     winston.error(error);

  //     if (session.inTransaction()) {
  //       await session.abortTransaction();
  //       session.endSession();
  //     }

  //     return res.status(StatusCodes.BAD_REQUEST).json({
  //       message: ReasonPhrases.BAD_REQUEST,
  //       status: StatusCodes.BAD_REQUEST
  //     });
  //   }
  // },



  // updateProfile: async (
  //   {
  //     context: { user },
  //     body: { firstName, lastName }
  //   }: ICombinedRequest<IUserRequest, UpdateProfilePayload>,
  //   res: Response
  // ) => {
  //   try {
  //     await userService.updateProfileByUserId(user.id, { firstName, lastName })

  //     const userMail = new UserMail()

  //     userMail.successfullyUpdatedProfile({
  //       email: user.email
  //     })

  //     return res.status(StatusCodes.OK).json({
  //       data: { firstName, lastName },
  //       message: ReasonPhrases.OK,
  //       status: StatusCodes.OK
  //     })
  //   } catch (error) {
  //     winston.error(error)

  //     return res.status(StatusCodes.BAD_REQUEST).json({
  //       message: ReasonPhrases.BAD_REQUEST,
  //       status: StatusCodes.BAD_REQUEST
  //     })
  //   }
  // },

  // updateEmail: async (
  //   {
  //     context: { user },
  //     body: { email, password }
  //   }: ICombinedRequest<IUserRequest, UpdateEmailPayload>,
  //   res: Response
  // ) => {
  //   const session = await startSession()

  //   try {
  //     if (user.email === email) {
  //       return res.status(StatusCodes.OK).json({
  //         data: { email },
  //         message: ReasonPhrases.OK,
  //         status: StatusCodes.OK
  //       })
  //     }

  //     const isUserExist = await userService.isExistByEmail(email)

  //     if (isUserExist) {
  //       return res.status(StatusCodes.CONFLICT).json({
  //         message: ReasonPhrases.CONFLICT,
  //         status: StatusCodes.CONFLICT
  //       })
  //     }

  //     const currentUser = await userService.getById(user.id)

  //     const comparePassword = currentUser?.comparePassword(password)
  //     if (!comparePassword) {
  //       return res.status(StatusCodes.FORBIDDEN).json({
  //         message: ReasonPhrases.FORBIDDEN,
  //         status: StatusCodes.FORBIDDEN
  //       })
  //     }

  //     session.startTransaction()

  //     await userService.updateEmailByUserId(user.id, email, session)

  //     const cryptoString = createCryptoString()

  //     const dateFromNow = createDateAddDaysFromNow(ExpiresInDays.Verification)

  //     let verification =
  //       await verificationService.findOneAndUpdateByUserIdAndEmail(
  //         {
  //           userId: user.id,
  //           email,
  //           accessToken: cryptoString,
  //           expiresIn: dateFromNow
  //         },
  //         session
  //       )

  //     if (!verification) {
  //       verification = await verificationService.create(
  //         {
  //           userId: user.id,
  //           email,
  //           accessToken: cryptoString,
  //           expiresIn: dateFromNow
  //         },
  //         session
  //       )
  //     }

  //     await userService.addVerificationToUser(
  //       {
  //         userId: user.id,
  //         verificationId: verification.id
  //       },
  //       session
  //     )

  //     const userMail = new UserMail()

  //     userMail.successfullyUpdatedEmail({ email })

  //     userMail.verification({
  //       email,
  //       accessToken: cryptoString
  //     })

  //     await session.commitTransaction()
  //     session.endSession()

  //     return res.status(StatusCodes.OK).json({
  //       data: { email },
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

  // updatePassword: async (
  //   {
  //     context: {
  //       user: { email }
  //     },
  //     body: { oldPassword, newPassword }
  //   }: ICombinedRequest<IUserRequest, UpdatePasswordPayload>,
  //   res: Response
  // ) => {
  //   try {
  //     const user = await userService.getByEmail(email)

  //     const comparePassword = user?.comparePassword(oldPassword)

  //     if (!user || !comparePassword) {
  //       return res.status(StatusCodes.FORBIDDEN).json({
  //         message: ReasonPhrases.FORBIDDEN,
  //         status: StatusCodes.FORBIDDEN
  //       })
  //     }

  //     const hashedPassword = await createHash(newPassword)

  //     await userService.updatePasswordByUserId(user.id, hashedPassword)

  //     const userMail = new UserMail()

  //     userMail.successfullyUpdatedPassword({ email: user.email })

  //     return res.status(StatusCodes.OK).json({
  //       message: ReasonPhrases.OK,
  //       status: StatusCodes.OK
  //     })
  //   } catch (error) {
  //     winston.error(error)

  //     return res.status(StatusCodes.BAD_REQUEST).json({
  //       message: ReasonPhrases.BAD_REQUEST,
  //       status: StatusCodes.BAD_REQUEST
  //     })
  //   }
  // },

  // updateAvatar: async (
  //   {
  //     context: { user },
  //     body: { imageId }
  //   }: ICombinedRequest<IUserRequest, { imageId: ObjectId }>,
  //   res: Response
  // ) => {
  //   try {
  //     await userController.deleteUserImages({ userId: user.id })

  //     await mediaService.updateById(imageId, {
  //       refType: MediaRefType.User,
  //       refId: user.id
  //     })

  //     return res.status(StatusCodes.OK).json({
  //       message: ReasonPhrases.OK,
  //       status: StatusCodes.OK
  //     })
  //   } catch (error) {
  //     winston.error(error)

  //     return res.status(StatusCodes.BAD_REQUEST).json({
  //       message: ReasonPhrases.BAD_REQUEST,
  //       status: StatusCodes.BAD_REQUEST
  //     })
  //   }
  // },

  deleteProfile: async (
    {
      context: {
        user: { id, phone_number },

      },
      body: { phone_number: bodyPhoneNumber }

    }: ICombinedRequest<IUserRequestwithId, DeleteProfilePayload>,
    res: Response
  ) => {

    const session = await startSession()

    try {
      if (phone_number !== bodyPhoneNumber) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Phone numbers do not match.',
          status: StatusCodes.BAD_REQUEST,
        });
      }
      // const user = await userService.getByphone_number(phone_number)
      // // const comparePassword = user?.comparePassword(password)
      // if (!user) {
      //   return res.status(StatusCodes.FORBIDDEN).json({
      //     message: ReasonPhrases.FORBIDDEN,
      //     status: StatusCodes.FORBIDDEN
      //   })
      // }
      session.startTransaction()
      console.log("sessionusercontroller", session)
      await userService.deleteById(id, session)
      console.log(`User with ID ${id} deleted successfully.`);
      await resetPasswordService.deleteManyByUserId(id, session)

      await verificationService.deleteManyByUserId(id, session)

      // const userMail = new UserMail()

      // userMail.successfullyDeleted({ email: user.email })

      await session.commitTransaction()
      session.endSession()
      console.log('User profile deleted successfully')
      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      })
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

  // deleteUserImages: async ({ userId }: { userId: ObjectId }) => {
  //   const images = await mediaService.findManyByRef({
  //     refType: MediaRefType.User,
  //     refId: userId
  //   })

  //   const promises = []

  //   for (let i = 0; i < images.length; i++) {
  //     promises.push(new Image(images[i]).deleteFile())
  //   }

  //   await Promise.all(promises)

  //   await mediaService.deleteManyByRef({
  //     refType: MediaRefType.User,
  //     refId: userId
  //   })
  // }
}
