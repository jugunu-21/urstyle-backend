import { Model, ObjectId, isObjectIdOrHexString } from 'mongoose'

export interface IProduct {
  category: string
  name: string
  subCategory: string
  link: string
  image_url: string
  price: string
  webLink: string
  review: ObjectId;
  description: string
  userId: ObjectId
}
export interface IProductinitial {
  category: string
  name: string
  subCategory: string
  link: string
  webLink: string
  image: string
  price: string
  review: ObjectId
  description: string
}

export interface IReview {
  id: ObjectId
  rname: string
  data: string
  content: string
  rating: string
}
export interface IPairing {
  pcategory: string
  look: string
  desc: string
  expected_delivery: string
  cart: ObjectId
  overall_description: string
}
export type ProductPayload = Pick<
  IProductinitial,
  'name' | 'price' | 'subCategory' | 'category' | 'link' | 'webLink' | 'image' | 'description'
>

