import mongoose from 'mongoose';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export function connectMongo() {
    mongoose.connect(serverRuntimeConfig.mongoURI);
}