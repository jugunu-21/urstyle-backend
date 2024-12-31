// import { Router } from 'express'
// import { auth } from './auth'
// import { users } from './users'
// import { product } from './product'
// import { media } from './media'
// import { collection } from './collection'
// const router: Router = Router()
// const routes: {
//     [key: string]: (router: Router) => void
// } = { users, auth, product, collection }

// for (const route in routes) {
//     routes[route](router)
// }
// export { router }

import { collectionController } from '@/controllers'
import { ImageMiddleware } from '@/middlewares'

import { Router } from 'express';
import { users } from './users';
import { auth } from './auth';
import { product } from './product';
import { media } from './media';
import { collection } from './collection';

import { userController } from '@/controllers/userController';

import { authController } from '@/controllers'
import { authGuard } from '@/guards'
import { authValidation } from '@/validations'
const router: Router = Router();
// router.get('/me', authGuard.isAuth, userController.me)
// router.post(
//     '/collection/upload',
//     authGuard.isAuth,
//     collectionController.collectionUpload
// );
// router.post(
//     '/auth/sign-in',
//     authGuard.isGuest,
//     authValidation.signIn,
//     authController.signIn
// );
router.post(
    '/auth/sign-up',
    authGuard.isGuest,
    authValidation.signUp,
    authController.signUp
);
// router.post(
//     '/collection/fetch',
//     collectionController.collectionFetch,
//     collectionController.LikedCollectionFetch
// )
// router.post('/collection/admincollectionfetch',
//     authGuard.isAuth,
//     collectionController.collectionbyUserId,

// )
// router.post('/collection/update/:collectionId',
//     authGuard.isAuth,
//     collectionController.collectionUpdate,

// )
// router.post('/collection/Like/:collectionId',
//     authGuard.isAuth,
//     collectionController.collectionLikeUnlike)
// router.delete('/collection/delete/:collectionId',
//     authGuard.isAuth,
//     collectionController.deletecollection)
// router.post('/collection/collectionByCollectionId/:collectionId',
//     collectionController.collectionbyColletionId)


export { router };