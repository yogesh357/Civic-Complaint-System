import express from 'express';
import userRouter from './routes/userRoutes.js';
import complaintRouter from './routes/complaintRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import aiRouter from './routes/aiRouter.js';

import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();




// Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({
  limit: '10kb',
  verify: (req, res, buf) => {
    try {
      if (buf && buf.length) {
        JSON.parse(buf.toString('utf8'));
      }
    } catch (e) {
      const error = new Error('Invalid JSON payload');
      error.status = 400;
      error.expose = true;
      throw error;
    }
  }
}));

app.use(express.urlencoded({
  extended: true,
  limit: '10kb',
  parameterLimit: 10 // Prevent too many parameters
}));

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
  exposedHeaders: ['set-cookie']
}));

// Routes
app.get('/', (req, res) => {
  res.send("Welcome To RequestHub");
});

app.use('/api/user', userRouter);
app.use('/api/complaints', complaintRouter);

app.use('/api/admin', adminRouter); // All admin routes will be under /api/admin

// route for ai estimation
app.use('/api', aiRouter)

// Error handling middleware
app.use(errorHandler);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});