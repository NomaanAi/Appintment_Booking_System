require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middleware/errorMiddleware');

// Connect to Database
// Connect to Database
connectDB();

// Initialize Automation
require('./src/services/cronService')();

const app = express();

// Middleware
app.use(require('./src/middleware/securityMiddleware').helmetConfig);
app.use('/api', require('./src/middleware/securityMiddleware').limiter);
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/appointments', require('./src/routes/appointmentRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/staff', require('./src/routes/staffRoutes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
