import { Router } from 'express'
import { authGuard } from '@/guards'
import { collectionController } from '@/controllers'
import { uploadSingleImageMiddleware, ImageMiddleware } from '@/middlewares' 
export const collection = (router: Router): void => {
  router.post(
    '/collection/upload',
    authGuard.isAuth,
    // ImageMiddleware,
    collectionController.collectionUpload
  )
  router.post(
    '/collection/fetch',
    authGuard.isAuth,
    collectionController.collectionFetch
  )
}
