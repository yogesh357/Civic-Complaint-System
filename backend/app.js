import express from 'express';
import userRouter from './routes/userRoutes.js';
import complaintRouter from './routes/complaintRoutes.js';
import adminRouter from './routes/adminRoutes.js'; // Add this import
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send("Welcome To RequestHub");
});

// Existing routes
app.use('/api/user', userRouter);
app.use('/api/complaints', complaintRouter);

// Add admin routes
app.use('/api/admin', adminRouter); // All admin routes will be under /api/admin

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});