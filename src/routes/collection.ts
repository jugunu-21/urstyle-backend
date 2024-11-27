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
  router.get(
    '/collection/fetch',
    collectionController.collectionFetch,
    collectionController.LikedCollectionFetch
  )
  router.post('/collection/admincollectionfetch',
    authGuard.isAuth,
    collectionController.collectionbyUserId,

  )
  router.post('/collection/update/:collectionId',
    authGuard.isAuth,
    collectionController.collectionUpdate,

  )
  router.post('/collection/Like/:collectionId',
    authGuard.isAuth,
    collectionController.collectionLikeUnlike)
  router.delete('/collection/delete/:collectionId',
    authGuard.isAuth,
    collectionController.deletecollection)
  router.post('/collection/collectionByCollectionId/:collectionId',
    collectionController.collectionbyColletionId)
}
