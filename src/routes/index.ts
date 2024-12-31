// import { Router } from 'express'
// import { auth } from './auth'
// import { users } from './users'
// import { product } from './product'
// import { media } from './media'
// import { collection } from './collection'
// const router: Router = Router()
// const routes: {
//   [key: string]: (router: Router) => void
// } = { users, auth, product, collection }

// for (const route in routes) {
//   routes[route](router)
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
import { authGuard } from '@/guards/authGuard';
import { userController } from '@/controllers/userController';

const router: Router = Router();
router.get('/me', authGuard.isAuth, userController.me)
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
// // Apply routes from each module
// users(router)
// auth(router)
// product(router);
// media(router);
// collection(router);

export { router };