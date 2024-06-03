import { NextFunction, Request, Response } from 'express'

import { getAccessTokenFromHeaders } from '@/utils/headers'
import { jwtVerify } from '@/utils/jwt'
import { userService } from '@/services'
import { redis } from '@/dataSources'

export const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    Object.assign(req, { context: {} })
console.log('req.headers', req.headers)
    const { accessToken } = getAccessTokenFromHeaders(req.headers)
    if (!accessToken) return next()
      console.log('accessToken', accessToken)
    const { id } = jwtVerify({ accessToken })
    console.log('id', id)
    if (!id) return next()

    // const isAccessTokenExpired = await redis.client.get(
    //   `expiredToken:${accessToken}`
    // )
    // if (isAccessTokenExpired) return next()

    const user = await userService.getById(id)
    console.log('user', user)
    if (!user) return next()

    Object.assign(req, {
      context: {
        user,
        accessToken
      }
    })
    console.log('req.body', req.body)
    console.log('req.context', req.context)
    return next()
  } catch (error) {
    return next()
  }
}
