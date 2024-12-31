
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'

export const corsMiddleware = cors({
  origin: process.env.CLIENT_URL || 'https://urtsyle.vercel.app',
  credentials: true,
  optionsSuccessStatus: StatusCodes.OK
})
