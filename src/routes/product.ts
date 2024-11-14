import { Router } from 'express'
import { authGuard } from '@/guards'
import { productController } from '@/controllers'
import { ImageMiddleware } from '@/middlewares'

export const product = (router: Router): void => {
  router.post(
    '/product/upload',
    authGuard.isAuth,
    ImageMiddleware,
    productController.productUpload
  )
  router.post(
    '/product/fetch',
    authGuard.isAuth,
    productController.productFetch
  )
  router.post(
    '/product/update/:id',
    authGuard.isAuth,
    ImageMiddleware,
    productController.productUpdate
  )

  router.delete(
    '/product/delete/:productId',
    authGuard.isAuth,
    productController.productDelete
  )
  router.post(
    '/product/fetch/:productId',
    productController.productFetchById
  )
}
