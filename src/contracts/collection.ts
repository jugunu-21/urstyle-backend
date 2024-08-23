import { Model, ObjectId, isObjectIdOrHexString } from 'mongoose'
export interface ICollection {

  name: string
  userId: ObjectId,
  description: string
  Ids: string[]

}
export type CollectionPayload = Pick<
  ICollection,
  'name' | 'description' | 'Ids'
>