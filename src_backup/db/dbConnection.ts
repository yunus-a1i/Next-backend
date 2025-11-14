import mongoose, { type Mongoose } from 'mongoose';

export async function dbConnect(): Promise<void> {
  try {
    const dbConnectionInstance: Mongoose = await mongoose.connect(
      `${process.env.DATABASE_URL as string}/${process.env.DB_NAME as string}`
    );
    if (dbConnectionInstance) {
      console.log('dbConnectionInstance - ', dbConnectionInstance.connection.host);
    }
  } catch (error: unknown) {
    console.log('Error in connecting Database', error as Error);
    process.exit(1);
  }
}
