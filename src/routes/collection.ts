import { Router } from 'express'
import { authGuard } from '@/guards'
import { collectionController } from '@/controllers'
import { ImageMiddleware } from '@/middlewares'
export const collection = (router: Router): void => {
  router.post(
    '/collection/upload',
    authGuard.isAuth,
    // ImageMiddleware,
    collectionController.collectionUpload
  )
  router.post(
    '/collection/fetch',
    // authGuard.isAuth,
    collectionController.collectionFetch,
    collectionController.LikedCollectionFetch
  )
  // router.post(
  //   '/collection/fetch/LikedCollection',
  //   authGuard.isAuth,
  //   collectionController.LikedCollectionFetch
  // )
  router.post('/collection/Like/:collectionId',
    authGuard.isAuth,
    collectionController.collectionLikeUnlike)

  router.post('/collection/collectionById/:collectionId',
      authGuard.isAuth,
      collectionController.collectionbyColletionId)
}
