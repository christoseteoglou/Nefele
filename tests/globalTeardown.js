import mongoose from 'mongoose';

module.exports = async () => {
    for (let k in mongoose.connection.collections) {
        await mongoose.connection.collections[k].drop();
    }
    await mongoose.connection.close();

    console.log('mongo closed');
    return;
};
