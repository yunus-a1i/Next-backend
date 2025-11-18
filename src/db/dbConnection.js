// src/db/dbConnection.js
import mongoose from 'mongoose';

export async function dbConnect() {
  try {
    const dbUrl = `${process.env.DATABASE_URL}/${process.env.DB_NAME}`;

    const dbConnectionInstance = await mongoose.connect(dbUrl);

    console.log('Database connected →', dbConnectionInstance.connection.host);
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}
