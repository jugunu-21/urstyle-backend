import { ObjectId } from "mongoose"

export interface ILike {
    userId: ObjectId
    collectionId:ObjectId
  }