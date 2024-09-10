
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'

export const corsMiddleware = cors({
  origin: [
    process.env.LOCAL_CLIENT_URL || 'http://localhost:3000',
    process.env.CLIENT_URL || 'https://urtsyle.vercel.app'

  ],
  credentials: true ,

  optionsSuccessStatus: StatusCodes.OK
})

console.log('CORS middleware invoked..........',corsMiddleware); 