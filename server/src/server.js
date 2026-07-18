import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';

dotenv.config();

const port = process.env.PORT || 5000;

try {
  await connectDatabase();

  const app = createApp();

  app.listen(port, () => {
    console.log(`Happy Path API running on port ${port}`);
  });
} catch (error) {
  console.error('Happy Path API failed to start.');
  console.error('Check MONGO_URI and make sure MongoDB is running before starting the server.');
  console.error(error.message);
  process.exit(1);
}
