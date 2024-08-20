
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'

export const corsMiddleware = cors({
  origin: '*',
  credentials: true ,
  optionsSuccessStatus: StatusCodes.OK
})

 // origin: process.env.CLIENT_URL,