
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'

export const corsMiddleware = cors({

  origin: process.env.CLIENT_URL,// Specify the origin of your frontend
  credentials: true ,// Allow sending of cookies

 
  optionsSuccessStatus: StatusCodes.OK
})
