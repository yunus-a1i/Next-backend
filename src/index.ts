import { dbConnect } from './db/dbConnection.js';
import { app } from './server.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

app.listen(process.env.PORT, () => {
  dbConnect();
  console.log(`server is running at ${process.env.PORT}`);
});


