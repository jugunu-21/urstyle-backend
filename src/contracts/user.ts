import { Model, ObjectId, isObjectIdOrHexString } from 'mongoose'

export interface IVerification {
  email: string
  accessToken: string
  expiresIn: Date
  user: ObjectId
}
export interface IItem{
  id: number
  name: ObjectId
  code: string
  link: string
  image_url: string
  price: string
  review: ObjectId
  description:string
}

export interface IReview{
  id:ObjectId
  rname:string
  data: string
 content : string
  rating: string
  
}
export interface ICart{
  id:string
 look:string
  desc: string
 expected_delivery: string
  cart: ObjectId
  overall_description:string 
  
} 

export interface IResetPassword {
  accessToken: string
  expiresIn: Date
  user: ObjectId
}

export interface IUser {
  id: ObjectId
  phone_number: string
  // otp:string
  email: string
  password: string
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
