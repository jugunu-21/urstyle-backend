import { Router } from 'express'

import { auth } from './auth'
import { users } from './users'
import { product } from './product'
import { media } from './media'
import { collection } from './collection'
const router: Router = Router()

const routes: {
  [key: string]: (router: Router) => void
} = { auth, users, product, collection,media }

for (const route in routes) {
  routes[route](router)
}

export { router }
