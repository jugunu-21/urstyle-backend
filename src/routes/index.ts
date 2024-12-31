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


import { Router } from 'express';
import { users } from './users';
import { auth } from './auth';
import { product } from './product';
import { media } from './media';
import { collection } from './collection';

const router: Router = Router();

// Apply routes from each module
users(router);
auth(router);
product(router);
media(router);
collection(router);

export { router };