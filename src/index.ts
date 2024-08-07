import express, { Express } from 'express'
import { join } from 'path'
require('dotenv').config();
import multer from 'multer';

import '@/infrastructure/logger'
import { mongoose, redis } from '@/dataSources'
import {
  corsMiddleware,
  authMiddleware,
  notFoundMiddleware,
  uploadSingleImageMiddleware
} from '@/middlewares'
import { router } from '@/routes'
import { i18next, i18nextHttpMiddleware } from '@/i18n'
mongoose.run()
redis.run()
const app: Express = express()
// const upload = multer({ dest: 'uploads/' });
app.use(
  join('/', process.env.STORAGE_PATH),
  express.static(join(__dirname, process.env.STORAGE_PATH))
)

app.use
(
  // upload.array('files', 10),
  express.json({ limit: '10mb' }),
  express.urlencoded({ limit: '10mb', extended: true }),
  corsMiddleware,
  i18nextHttpMiddleware.handle(i18next),
  // uploadSingleImageMiddleware,
  authMiddleware,
  router,
  notFoundMiddleware
)

app.listen(process.env.APP_PORT)
