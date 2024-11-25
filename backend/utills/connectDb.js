import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connected successfully`);
  } catch (error) {
    console.log("Error connecting to mongodb", error.message);
    process.exit(0);
  }
};
