import { Model, ObjectId, isObjectIdOrHexString } from 'mongoose'

export interface IProduct {
  id: number
  name: string
  code: string
  link: string
  image_url: {
    public_id: {
      type: string
      required: true
    }
    url: {
      type: string
      required: true
    }
  }

  price: string
  review: ObjectId
  description: string
}
export interface IProductinitial {
  id: number
  name: string
  code: string
  link: string
  image: Buffer
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
  id: string
  look: string
  desc: string
  expected_delivery: string
  cart: ObjectId
  overall_description: string
}
export type ProductPayload = Pick<
  IProductinitial,
  'name' | 'price' | 'code' | 'id' | 'link' | 'image' | 'description'
>
