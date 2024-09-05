// src/dataSources/mongooseConfig.ts

import mongoose from 'mongoose';

export const mongooseConfig = () => {
  mongoose.set('strictQuery', false);
};