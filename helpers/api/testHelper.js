import mongoose from 'mongoose';

export async function jestAfterAll() {
    for (let k in mongoose.connection.collections) {
        await mongoose.connection.collections[k].drop();
    }
    await mongoose.connection.close();
    return;
}