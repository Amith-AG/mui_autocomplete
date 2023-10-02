import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL as string);
    console.log("connected to MongoDb");
  } catch (error) {
    console.log(error);
  }
};