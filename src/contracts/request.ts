import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { Document } from 'mongoose'
import { ObjectId } from 'mongoose';
import { IUser } from './user'

export interface IContextRequest<T> extends Omit<Request, 'context'> {
  context: T
}
export interface IContextRequest<T> extends Omit<Request, 'context'> {
  context: T
}
export interface IfileRequest<T> extends Omit<Request, 'file'> {
  file: T
}
export interface IBodyRequest<T> extends Omit<Request, 'body'> {
  // body: T & { email?: string; phone_number?: string };
  body: T & { phone_number?: string };
}

export interface IContextandBodyRequest<T,S>extends Omit<Request, 'context'&'body'> 
{
  context: T,
  body: S
}
export interface IContextandBodyRequestforProducts<T>extends Omit<Request, 'context'> 
{
  context: T
}
export interface IProductBodyRequestRaw<T> extends Omit<Request, 'body'> {
  body: T & {
    name: string,
    price: string,
    code: string,
    pid: number,
    link: string,
    image: string,
    description: string
  };
}


export interface IParamsRequest<T> extends Request {
  params: T & ParamsDictionary
}

export interface IQueryRequest<T> extends Request {
  query: T & ParamsDictionary
}

export interface ICombinedRequest<
  Context,
  Body,
  Params = Record<string, unknown>,
  Query = Record<string, unknown>
> extends Pick<IContextRequest<Context>, 'context'>,
    Pick<IBodyRequest<Body>, 'body'>,
    Pick<IParamsRequest<Params>, 'params'>,
    Pick<IQueryRequest<Query>, 'query'> {}

export interface IUserRequest
 {
  user: Omit<IUser, 'id'> & Document
  accessToken: string
}
export interface IUserRequest
 {
  user: Omit<IUser, 'id'> & Document
  accessToken: string
}
export interface IUserRequestwithid 
{
  user: Omit<IUser, 'phone_number'& 'likes'> & Document
  accessToken: string
}
export interface IUserRequestwithId 
{
  user:IUser & Document
  accessToken: string
}
