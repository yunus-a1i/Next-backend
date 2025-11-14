import { dbConnect } from './db/dbConnection.ts';
import { app } from './server.ts';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

app.listen(process.env.PORT, () => {
  dbConnect();
  console.log(`server is running at ${process.env.PORT}`);
});
