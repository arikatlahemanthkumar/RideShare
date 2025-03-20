import { configureStore } from "@reduxjs/toolkit";
import tripReducer from "../redux/slices/trip-slice"
import bookingReducer from "../redux/slices/booking-slice"
import carReducer from "../redux/slices/car-slice"
import adminReducer from "../redux/slices/admin-slice"
import reviewReducer from "../redux/slices/review-slice"
import travellerReducer from "../redux/slices/traveller-slice"
import paymentReducer from "../redux/slices/payment-slice"

const store = configureStore({
  reducer: {
    trips: tripReducer,
    cars:carReducer,
    bookings:bookingReducer,
    admin:adminReducer,
    review:reviewReducer,
    traveller:travellerReducer,
    payments:paymentReducer
  },
 
});



export default store;
