
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';

export const corsMiddleware = cors({
  origin: process.env.CLIENT_URL, // Ensure this is the correct origin of your frontend
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: StatusCodes.OK
});
