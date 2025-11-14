import mongoose from 'mongoose';
export async function dbConnect() {
    try {
        const dbConnectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DB_NAME}`);
        if (dbConnectionInstance) {
            console.log('dbConnectionInstance - ', dbConnectionInstance.connection.host);
        }
    }
    catch (error) {
        console.log('Error in connecting Database', error);
        process.exit(1);
    }
}
//# sourceMappingURL=dbConnection.js.map