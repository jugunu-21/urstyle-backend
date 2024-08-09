import { Model, ObjectId } from 'mongoose'

export interface IMedia {
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
  orderColumn?: number
  refType?: string
  refId?: ObjectId
}

export type ImediaCompress={
  filess:any
  destination:string
  path:string[]
}
export interface IfileRequest<T> extends Omit<ImediaCompress, 'filess'> {
  filess: T
  destination:string
  path:string[]

}
export type CreateMediaPayload = Omit<
  IMedia,
  'refId' | 'refType' | 'orderColumn'
>

export type UpdateMediaPayload = Pick<IMedia, 'refId' | 'refType'>

export type MediaModel = Model<IMedia>
