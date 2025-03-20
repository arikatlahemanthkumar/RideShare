import  express from 'express';
import  dotenv from 'dotenv';
import  cors from 'cors';
import  connectDB from './config/db.js';

import userRoutes from './app/routes/user-routes.js';
import carDetailsRoutes from './app/routes/carDetails-routes.js'
import travellerRoutes from './app/routes/traveller-routes.js'
import tripRoutes from './app/routes/trip-routes.js'
import bookingRoutes from './app/routes/booking-routes.js'
import paymentRoutes from './app/routes/payment-routes.js'
import reviewRoutes from './app/routes/review-routes.js'
import adminRoutes from "./app/routes/admin-routes.js"
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api',userRoutes) 
app.use('/api',carDetailsRoutes)
app.use('/api',travellerRoutes)
app.use('/api',tripRoutes)
app.use('/api',bookingRoutes)
app.use('/api',paymentRoutes)
app.use('/api',reviewRoutes)
app.use('/api',adminRoutes)

const PORT = process.env.PORT || 3050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));