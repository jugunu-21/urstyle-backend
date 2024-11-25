
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
app.use('/', (req, res) => {
  res.json({ message: 'Welcome to URSTYLE Backend API' });
});


// app.use(
//   express.json({ limit: '10mb' }),
//   express.urlencoded({ limit: '10mb', extended: true }),
//   // corsMiddleware,
//   // i18nextHttpMiddleware.handle(i18next),
//   // authMiddleware,
//   router,
//   // notFoundMiddleware
// )
app.listen('9000', () => {
  console.log("dfcgvhbjnkmememmem")
})
