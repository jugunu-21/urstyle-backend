import { Model, ObjectId, isObjectIdOrHexString } from 'mongoose'
import { ILike } from './like'
import { IDislike } from './dislike'
export interface IVerification {
  email: string
  accessToken: string
  expiresIn: Date
  user: ObjectId
}


export interface IResetPassword {
  accessToken: string
  expiresIn: Date
  user: ObjectId
}

export interface IUser {
  likes?: Array<ILike>
  dislikes?: Array<IDislike>
  id: ObjectId
  phone_number: string
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  verified: boolean
  verifications?: ObjectId[]
  resetPasswords?: ObjectId[]
}

export interface IUserMethods {
  comparePassword: (password: string) => boolean
}

export type UserModel = Model<IUser, unknown, IUserMethods>

export type VerificationRequestPayload = Pick<IUser, 'email' | 'phone_number'>;


export type UpdateProfilePayload = Required<
  Pick<IUser, 'firstName' | 'lastName'>
>

export type UpdateEmailPayload = Pick<IUser, 'email' | 'password'>

export interface UpdatePasswordPayload {
  oldPassword: string
  newPassword: string
}

export interface DeleteProfilePayload {
 phone_number: string
}
