import { Router } from 'express'
import { authGuard } from '@/guards'
import { collectionController } from '@/controllers'
import { ImageMiddleware } from '@/middlewares'
export const collection = (router: Router): void => {
  router.post(
    '/collection/upload',
    authGuard.isAuth,
    collectionController.collectionUpload
  )
  router.post(
    '/collection/fetch',
    collectionController.collectionFetch,
    collectionController.LikedCollectionFetch
  )
  router.post('/collection/Like/:collectionId',
    authGuard.isAuth,
    collectionController.collectionLikeUnlike)
  router.post('/collection/collectionByCollectionId/:collectionId',
    collectionController.collectionbyColletionId)
}
