// import express, { Express } from 'express'
// import { join } from 'path'
// require('dotenv').config();
// import multer from 'multer';

// import '@/infrastructure/logger'
// import { mongoose, redis } from '@/dataSources'
// import {
//   corsMiddleware,
//   authMiddleware,
//   notFoundMiddleware,
//   uploadSingleImageMiddleware
// } from '@/middlewares'
// import { router } from '@/routes'
// import { i18next, i18nextHttpMiddleware } from '@/i18n'
// import { Request, Response } from 'express-serve-static-core';
// mongoose.run()
// redis.run()
// const app: Express = express()
// const upload = multer();
// app.use(
//   join('/', process.env.STORAGE_PATH),
//   express.static(join(__dirname, process.env.STORAGE_PATH))
// )
// app.use
// (
//   express.json({ limit: '10mb' }),
//   // express.urlencoded({ limit: '10mb', extended: true }),
//   corsMiddleware,
//   i18nextHttpMiddleware.handle(i18next),
//   authMiddleware,
//   router,
//   notFoundMiddleware
// )

// const port = process.env.APP_PORT || 8000 ; 

// app.listen(port, () => console.log(`Server listening on port ${port}`));
import express, { Express } from 'express'
import { join } from 'path'
import 'dotenv/config'

import '@/infrastructure/logger'
import { mongoose, redis } from '@/dataSources'
import {
  corsMiddleware,
  authMiddleware,
  notFoundMiddleware
} from '@/middlewares'
import { router } from '@/routes'
import { i18next, i18nextHttpMiddleware } from '@/i18n'

mongoose.run()
redis.run()

const app: Express = express()

app.use(
  join('/', process.env.STORAGE_PATH),
  express.static(join(__dirname, process.env.STORAGE_PATH))
)

app.use(
  express.json({ limit: '10mb' }),
  express.urlencoded({ limit: '10mb', extended: true }),
  corsMiddleware,
  i18nextHttpMiddleware.handle(i18next),
  authMiddleware,
  router,
  notFoundMiddleware
)

app.listen(process.env.APP_PORT)
