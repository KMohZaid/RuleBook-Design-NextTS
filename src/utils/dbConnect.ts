import mongoose from 'mongoose';

const dbConnect = async () => {
	if (mongoose.connections[0].readyState) return; // Already connected
	await mongoose.connect(process.env.MONGODB_URI as string, { dbName: process.env.MONGODB_DB_NAME as string });
};

export default dbConnect;

