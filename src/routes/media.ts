import { Router } from 'express'
import { authGuard } from '@/guards'
import { mediaController } from '@/controllers'
import { uploadSingleImageMiddleware } from '@/middlewares'

export const media = (router: Router): void => {
  router.post(
    '/media/image/upload',
    authGuard.isAuth,
    uploadSingleImageMiddleware,
    mediaController.imageUpload
  )
  // router.post('', authGuard.isAuth, mediaController.itemupload)
 
   router.post(
    '/media/product/upload',
    authGuard.isAuth,
    mediaController.productUpload
  )
}
