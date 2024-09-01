import { ObjectId } from "mongoose"

export interface IDislike {
  userId: ObjectId
  collectionId:ObjectId
}