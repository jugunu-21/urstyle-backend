import { Router } from 'express'
import { authGuard } from '@/guards'
import { mediaController } from '@/controllers'
import { uploadSingleImageMiddleware, ImageMiddleware } from '@/middlewares'

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
    ImageMiddleware,
    mediaController.imageUpload
  )
}
