import { Router } from 'express'
import { authGuard } from '@/guards'
import { mediaController } from '@/controllers'
import { uploadSingleImageMiddleware , uploadMultipleImageMiddleware} from '@/middlewares'

export const media = (router: Router): void => {
  router.post(
    '/media/image/upload',
    authGuard.isAuth,
    uploadSingleImageMiddleware,
    mediaController.imageUpload
  )
  router.post(
    '/media/images/upload',
    authGuard.isAuth,
    uploadMultipleImageMiddleware,
    mediaController.imageUpload
  )

  // router.post('', authGuard.isAuth, mediaController.imageUpload)
 
   router.post(
    '/media/product/upload',
    authGuard.isAuth,
    mediaController.productUpload
  )
  router.post(
    '/media/product/fetch',
    authGuard.isAuth,
    mediaController.productFetch
  )
  router.post(
    '/media/product/update/:id',
    authGuard.isAuth,
    mediaController.productUpdate
  )
  // router.post(
  //   '/media/productImage/update/:id',
  //   authGuard.isAuth,
  //   mediaController.productImageUpdate
  // )
  router.post(
    '/media/product/delete/:id',
    authGuard.isAuth,
    mediaController.productDelete
  )
}
