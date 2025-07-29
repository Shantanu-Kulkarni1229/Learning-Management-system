import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebHooks } from './controllers/webHooks.js';
import serverless from 'serverless-http';

const app = express();

// Connect to DB
connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API working');
});
app.post('/clerk', express.json(), clerkWebHooks);

// Export as serverless function
export const handler = serverless(app);
