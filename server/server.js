import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebHooks } from './controllers/webHooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    // console.log('MongoDB connected');

    await connectCloudinary();

    app.use(cors());
    app.use(clerkMiddleware());
    app.use(express.json());

    app.get('/', (req, res) => res.send('API working'));
    app.post('/clerk', clerkWebHooks);
    app.use('/api/educator', educatorRouter);

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
