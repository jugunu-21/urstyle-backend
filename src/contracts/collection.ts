import {ObjectId,} from 'mongoose'
import { ILike } from './like'
import { IDislike } from './dislike'
export interface ICollection {
  name: string
  userId: ObjectId
  description: string
  Ids: string[]
  likes?: Array<ILike>
  dislikes?: Array<IDislike>
  collectionCategory:string[]
}
export type CollectionPayload = Pick<
  ICollection,
  'name' | 'description' | 'Ids' |'collectionCategory'
>